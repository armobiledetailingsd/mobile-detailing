import { createDataAttribute } from '@sanity/visual-editing';
import { dataset, projectId } from './client';

const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? 'http://localhost:3333';

export function createDocDataAttribute(
  doc: { _id: string; _type: string },
  path: string = 'title',
) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
    id: doc._id,
    type: doc._type,
    path,
  });
}
