import { defineArrayMember, defineField, defineType } from 'sanity';
import { ArrowRightIcon } from '@sanity/icons';

const ICON_OPTIONS = [
  'phone', 'map-pin', 'navigation', 'clock', 'wrench', 'check', 'check-circle',
  'arrow-right', 'star', 'shield', 'truck', 'alert-triangle', 'dollar-sign', 'message', 'gauge',
].map((v) => ({ title: v, value: v }));

export const finalCta = defineType({
  name: 'finalCta',
  title: 'Final CTA',
  type: 'object',
  icon: ArrowRightIcon,
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
      rows: 2,
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone number (href)',
      type: 'string',
      description: 'Used in tel: link. E.164 preferred: +15124567890.',
      validation: (Rule) =>
        Rule.required().regex(/^\+?1?\d{10}$|^\+\d{7,15}$/, { name: 'phone number', invert: false }),
    }),
    defineField({
      name: 'phoneDisplay',
      title: 'Phone number (display)',
      type: 'string',
      description: 'Formatted for display, e.g. (512) 456-7890',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'trustItems',
      title: 'Trust items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trustItem',
          fields: [
            defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: ICON_OPTIONS } }),
            defineField({ name: 'text', title: 'Text', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'text' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return { title: 'Final CTA', subtitle: heading ?? '' };
    },
  },
});
