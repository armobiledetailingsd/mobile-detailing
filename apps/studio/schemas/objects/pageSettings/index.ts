import { defineField, defineType } from 'sanity';

export const pageSettings = defineType({
  name: 'pageSettings',
  title: 'Page settings',
  type: 'object',
  fields: [
    defineField({
      name: 'hideNavigation',
      title: 'Hide site navigation',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'hideFooter',
      title: 'Hide site footer',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
