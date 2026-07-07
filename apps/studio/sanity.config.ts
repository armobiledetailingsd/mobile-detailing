import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool, defineLocations } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { structure } from './structure';

const PLACEHOLDER_PROJECT_ID = 'your-sanity-project-id';
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? PLACEHOLDER_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const title = process.env.SANITY_STUDIO_TITLE ?? 'Studio';

if (projectId === PLACEHOLDER_PROJECT_ID) {
  console.warn(
    '\n[Sanity] SANITY_STUDIO_PROJECT_ID not set. The Studio will boot but content queries will fail until you copy apps/studio/.env.example to apps/studio/.env and set your real project ID.\n',
  );
}

const PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL ?? 'http://localhost:3000';

export default defineConfig({
  name: 'default',
  title,
  projectId,
  dataset,
  autoUpdatesEnabled: false,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: PREVIEW_URL,
        preview: '/',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        locations: {
          websitePage: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => {
              const slug = doc?.slug;
              if (!slug) return { locations: [] };
              const href = slug === 'homepage' ? '/' : `/${slug}`;
              return {
                locations: [
                  { title: doc?.title ?? 'Untitled', href },
                  { title: 'All pages', href: '/' },
                ],
              };
            },
          }),
          siteSettings: defineLocations({
            message: 'Site settings affect every page.',
            tone: 'caution',
            locations: [{ title: 'Homepage', href: '/' }],
          }),
          headerNavigation: defineLocations({
            message: 'Header navigation appears on every page.',
            tone: 'caution',
            locations: [{ title: 'Homepage', href: '/' }],
          }),
          footerNavigation: defineLocations({
            message: 'Footer navigation appears on every page.',
            tone: 'caution',
            locations: [{ title: 'Homepage', href: '/' }],
          }),
        },
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
