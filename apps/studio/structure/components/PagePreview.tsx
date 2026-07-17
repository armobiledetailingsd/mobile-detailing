import { useCallback, useEffect, useState } from 'react';
import { Box, Button, Card, Flex, Spinner, Text } from '@sanity/ui';
import { RefreshIcon } from '@sanity/icons';
import { useClient, useCurrentUser } from 'sanity';
import type { UserViewComponent } from 'sanity/structure';
import { createPreviewSecret } from '@sanity/preview-url-secret/create-secret';
import {
  urlSearchParamPreviewPathname,
  urlSearchParamPreviewPerspective,
  urlSearchParamPreviewSecret,
} from '@sanity/preview-url-secret/constants';

const PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL ?? 'http://localhost:3000';
const ENABLE_DRAFT_MODE_PATH = '/api/draft-mode/enable';

function resolvePathname(slug: string | undefined): string {
  if (!slug || slug === 'homepage') return '/';
  return `/${slug}`;
}

export const PagePreview: UserViewComponent = ({ document }) => {
  const client = useClient({ apiVersion: '2025-02-19' });
  const currentUser = useCurrentUser();
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const slug =
    typeof document.displayed?.slug === 'object' && document.displayed.slug !== null
      ? (document.displayed.slug as { current?: string }).current
      : undefined;
  const pathname = resolvePathname(slug);

  const generatePreviewUrl = useCallback(async () => {
    setError(null);
    try {
      const { secret } = await createPreviewSecret(
        client,
        'sanity/structure',
        location.href,
        currentUser?.id,
      );

      const enableUrl = new URL(ENABLE_DRAFT_MODE_PATH, PREVIEW_URL);
      enableUrl.searchParams.set(urlSearchParamPreviewSecret, secret);
      enableUrl.searchParams.set(urlSearchParamPreviewPerspective, 'drafts');
      enableUrl.searchParams.set(urlSearchParamPreviewPathname, pathname);

      setPreviewSrc(enableUrl.toString());
    } catch {
      setError('Could not generate a preview link. Check SANITY_STUDIO_PREVIEW_URL and your read token.');
    }
  }, [client, currentUser?.id, pathname]);

  useEffect(() => {
    generatePreviewUrl();
  }, [generatePreviewUrl]);

  return (
    <Flex direction="column" height="fill">
      <Card padding={2} borderBottom>
        <Flex align="center" justify="space-between">
          <Text size={1} muted>
            {PREVIEW_URL}
            {pathname}
          </Text>
          <Button
            icon={RefreshIcon}
            mode="bleed"
            text="Refresh"
            onClick={generatePreviewUrl}
          />
        </Flex>
      </Card>
      <Box flex={1} style={{ position: 'relative' }}>
        {error && (
          <Card padding={4} tone="critical">
            <Text size={1}>{error}</Text>
          </Card>
        )}
        {!error && !previewSrc && (
          <Flex align="center" justify="center" height="fill">
            <Spinner muted />
          </Flex>
        )}
        {!error && previewSrc && (
          <iframe
            key={previewSrc}
            src={previewSrc}
            title="Page preview"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        )}
      </Box>
    </Flex>
  );
};
