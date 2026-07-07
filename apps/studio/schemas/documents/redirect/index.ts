import { defineField, defineType } from 'sanity';
import { TransferIcon } from '@sanity/icons';

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: TransferIcon,
  fields: [
    defineField({
      name: 'from',
      title: 'From',
      type: 'string',
      description:
        'Source path on this site. Start with a leading slash. Wildcards: `:slug` matches a single segment, `:path*` matches everything after this point.',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          if (!value.startsWith('/')) return 'Must start with a leading slash.';
          return true;
        }),
    }),
    defineField({
      name: 'to',
      title: 'To',
      type: 'string',
      description:
        'Destination — either a path (starts with `/`) or a full URL (https://…). Wildcard captures from the source can be reused (e.g. `/articles/:slug`).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'redirectType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: '301 — Permanent', value: '301' },
          { title: '302 — Temporary', value: '302' },
          { title: '307 — Temporary (preserves method)', value: '307' },
          { title: '308 — Permanent (preserves method)', value: '308' },
        ],
        layout: 'dropdown',
      },
      initialValue: '301',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { from: 'from', to: 'to', redirectType: 'redirectType' },
    prepare({ from, to, redirectType }) {
      return {
        title: from ?? '(no source)',
        subtitle: `${redirectType ?? '301'} → ${to ?? '(no destination)'}`,
      };
    },
  },
});
