import type { SchemaTypeDefinition } from 'sanity';
import { documentTypes } from './documents';
import { objectTypes } from './objects';
import { sectionTypes } from './sections';

export const schemaTypes: SchemaTypeDefinition[] = [
  ...documentTypes,
  ...objectTypes,
  ...sectionTypes,
];
