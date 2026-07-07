import { NextResponse, type NextRequest } from 'next/server';
import { getAllRedirects } from '@/lib/sanity/queries/redirects';

type RedirectType = '301' | '302' | '307' | '308';

type ExactRule = { destination: string; statusCode: RedirectType };
type WildcardRule = {
  pattern: RegExp;
  destinationTemplate: string;
  captureNames: string[];
  statusCode: RedirectType;
};

type RedirectTable = {
  exact: Map<string, ExactRule>;
  wildcards: WildcardRule[];
};

const CACHE_TTL_MS = 60_000;
const MAX_CHAIN_DEPTH = 10;
const EMPTY_TABLE: RedirectTable = { exact: new Map(), wildcards: [] };

// Module-scoped cache (per-instance — different Vercel edge instances cache independently)
let cachedTable: RedirectTable | null = null;
let cachedAt = 0;
let pendingFetch: Promise<RedirectTable> | null = null;

const isWildcard = (from: string) => /:[a-zA-Z]/.test(from);

function parseWildcard(from: string, to: string, statusCode: RedirectType): WildcardRule {
  const captureNames: string[] = [];

  // Replace :name and :name* with regex groups, using sentinels so we can escape the rest.
  let patternStr = from
    .replace(/:([a-zA-Z][a-zA-Z0-9]*)\*/g, (_, name) => {
      captureNames.push(`${name}*`);
      return '\x00W\x00';
    })
    .replace(/:([a-zA-Z][a-zA-Z0-9]*)/g, (_, name) => {
      captureNames.push(name);
      return '\x00S\x00';
    });

  patternStr = patternStr.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  patternStr = patternStr.replace(/\x00W\x00/g, '(.*)').replace(/\x00S\x00/g, '([^/]+)');

  return {
    pattern: new RegExp(`^${patternStr}$`),
    destinationTemplate: to,
    captureNames,
    statusCode,
  };
}

function buildTable(redirects: Awaited<ReturnType<typeof getAllRedirects>>): RedirectTable {
  const exact = new Map<string, ExactRule>();
  const wildcards: WildcardRule[] = [];

  for (const r of redirects) {
    if (!r.from || !r.to) continue;
    const statusCode = (r.redirectType ?? '301') as RedirectType;

    if (isWildcard(r.from)) {
      wildcards.push(parseWildcard(r.from, r.to, statusCode));
    } else {
      exact.set(r.from, { destination: r.to, statusCode });
    }
  }

  return { exact, wildcards };
}

async function loadTable(): Promise<RedirectTable> {
  try {
    const redirects = await getAllRedirects();
    return buildTable(redirects);
  } catch (error) {
    console.error('[middleware] Failed to load redirects from Sanity:', error);
    return EMPTY_TABLE;
  }
}

async function getTable(): Promise<RedirectTable> {
  const now = Date.now();
  if (cachedTable && now - cachedAt < CACHE_TTL_MS) return cachedTable;
  if (pendingFetch) return pendingFetch;

  pendingFetch = loadTable()
    .then((table) => {
      cachedTable = table;
      cachedAt = Date.now();
      return table;
    })
    .finally(() => {
      pendingFetch = null;
    });

  return pendingFetch;
}

function matchWildcard(pathname: string, wildcards: WildcardRule[]): ExactRule | null {
  for (const w of wildcards) {
    const match = pathname.match(w.pattern);
    if (!match) continue;

    let destination = w.destinationTemplate;
    w.captureNames.forEach((name, i) => {
      const placeholder = name.endsWith('*') ? `:${name.slice(0, -1)}*` : `:${name}`;
      destination = destination.replace(placeholder, match[i + 1] ?? '');
    });

    return { destination: destination || '/', statusCode: w.statusCode };
  }
  return null;
}

function resolveRedirect(pathname: string, table: RedirectTable): ExactRule | null {
  let current = pathname;
  let final: ExactRule | null = null;

  // Follow chains up to MAX_CHAIN_DEPTH to handle redirect → redirect → final.
  for (let i = 0; i < MAX_CHAIN_DEPTH; i++) {
    const exact = table.exact.get(current);
    const hit = exact ?? matchWildcard(current, table.wildcards);
    if (!hit) break;

    final = hit;
    // If the destination is absolute (http/https) or unchanged, stop chaining.
    if (/^https?:\/\//i.test(hit.destination) || hit.destination === current) break;
    current = hit.destination;
  }

  return final;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const table = await getTable();

  const hit = resolveRedirect(pathname, table);
  if (!hit) return NextResponse.next();

  const destinationUrl = /^https?:\/\//i.test(hit.destination)
    ? hit.destination
    : new URL(hit.destination, request.url).toString();

  return NextResponse.redirect(destinationUrl, Number(hit.statusCode));
}

export const config = {
  // Skip Next internals and common static files. Tweak as routes grow.
  matcher: [
    '/((?!_next/static|_next/image|api|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|js|css)).*)',
  ],
};
