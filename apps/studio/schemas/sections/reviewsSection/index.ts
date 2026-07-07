import { defineArrayMember, defineField, defineType } from 'sanity';
import { CommentIcon } from '@sanity/icons';

export const reviewsSection = defineType({
  name: 'reviewsSection',
  title: 'Reviews',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(5).precision(1),
    }),
    defineField({
      name: 'reviewCount',
      title: 'Review count',
      type: 'number',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'quotes',
      title: 'Quotes',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reviewQuote',
          fields: [
            defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'city', title: 'City', type: 'string' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'city' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return { title: 'Reviews', subtitle: heading ?? '' };
    },
  },
});
