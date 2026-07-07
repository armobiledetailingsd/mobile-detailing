import { defineArrayMember, defineField, defineType } from 'sanity';
import { ThListIcon } from '@sanity/icons';

export const footerNavigation = defineType({
  name: 'footerNavigation',
  title: 'Footer Navigation',
  type: 'document',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal label only.',
      initialValue: 'Footer Navigation',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'column',
          title: 'Column',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
            }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [defineArrayMember({ type: 'link' })],
            }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: title ?? 'Untitled column' };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright notice',
      type: 'string',
      description: 'Plain text shown in the footer. Use {year} as a token for the current year.',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Footer Navigation' };
    },
  },
});
