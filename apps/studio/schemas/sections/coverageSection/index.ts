import { defineArrayMember, defineField, defineType } from 'sanity';
import { PinIcon } from '@sanity/icons';

export const coverageSection = defineType({
  name: 'coverageSection',
  title: 'Coverage',
  type: 'object',
  icon: PinIcon,
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
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'towns',
      title: 'Towns',
      type: 'array',
      description: 'List of towns in the service area.',
      validation: (Rule) => Rule.required().min(1),
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return { title: 'Coverage', subtitle: heading ?? '' };
    },
  },
});
