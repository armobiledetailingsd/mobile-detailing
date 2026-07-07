import { defineField, defineType } from 'sanity';
import { TextIcon } from '@sanity/icons';

export const richText = defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { body: 'body' },
    prepare({ body }) {
      const first = body?.[0]?.children?.[0]?.text as string | undefined;
      return {
        title: 'Rich Text',
        subtitle: first?.slice(0, 80) ?? '(empty)',
      };
    },
  },
});
