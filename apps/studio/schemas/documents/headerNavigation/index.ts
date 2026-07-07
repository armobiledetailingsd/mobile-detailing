import { defineArrayMember, defineField, defineType } from 'sanity';
import { MenuIcon } from '@sanity/icons';

export const headerNavigation = defineType({
  name: 'headerNavigation',
  title: 'Header Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal label only.',
      initialValue: 'Header Navigation',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Primary links',
      type: 'array',
      of: [defineArrayMember({ type: 'link' })],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Header Navigation' };
    },
  },
});
