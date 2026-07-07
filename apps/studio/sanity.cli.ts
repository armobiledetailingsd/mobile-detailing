import { defineCliConfig } from 'sanity/cli';

const PLACEHOLDER_PROJECT_ID = 'your-sanity-project-id';
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? PLACEHOLDER_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

if (projectId === PLACEHOLDER_PROJECT_ID) {
  console.warn(
    '\n[Sanity] SANITY_STUDIO_PROJECT_ID not set. Copy apps/studio/.env.example to apps/studio/.env and set your real project ID before running CLI commands.\n',
  );
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    autoUpdates: true,
  },
});
