// TypeScript declarations for environment variables we read in this app.

declare namespace NodeJS {
  interface ProcessEnv {
    // Sanity — public (exposed to the browser bundle)
    NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
    NEXT_PUBLIC_SANITY_DATASET?: string;
    NEXT_PUBLIC_SANITY_API_VERSION?: string;
    NEXT_PUBLIC_SANITY_STUDIO_URL?: string;

    // Sanity — server-only
    SANITY_API_READ_TOKEN?: string;
    SANITY_VIEWER_TOKEN?: string;

    // Site
    NEXT_PUBLIC_SITE_URL?: string;
  }
}
