import { defineArrayMember, defineField, defineType } from 'sanity';
import { ControlsIcon } from '@sanity/icons';

const ICON_OPTIONS = [
  'phone', 'map-pin', 'navigation', 'clock', 'wrench', 'check', 'check-circle',
  'arrow-right', 'star', 'shield', 'truck', 'alert-triangle', 'dollar-sign', 'message', 'gauge',
].map((v) => ({ title: v, value: v }));

export const servicesSection = defineType({
  name: 'servicesSection',
  title: 'Services',
  type: 'object',
  icon: ControlsIcon,
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
      name: 'services',
      title: 'Services',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'serviceItem',
          fields: [
            defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: ICON_OPTIONS } }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'price', title: 'Price', type: 'string', description: 'Optional, e.g. "$49"' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'price' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return { title: 'Services', subtitle: heading ?? '' };
    },
  },
});
