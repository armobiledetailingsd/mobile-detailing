import { defineArrayMember, defineField, defineType } from 'sanity';
import { ControlsIcon } from '@sanity/icons';

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
      name: 'packages',
      title: 'Packages',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'servicePackage',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'price', title: 'Price ($)', type: 'number', validation: (Rule) => Rule.required().positive() }),
            defineField({ name: 'duration', title: 'Duration', type: 'string', description: 'e.g. "~45 min"', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({
              name: 'includes',
              title: 'Includes',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
            }),
            defineField({ name: 'popular', title: 'Most popular?', type: 'boolean' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'price' },
            prepare({ title, subtitle }) {
              return { title, subtitle: subtitle ? `$${subtitle}` : '' };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'addons',
      title: 'Add-ons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'serviceAddon',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'price', title: 'Price ($)', type: 'number', validation: (Rule) => Rule.required().positive() }),
            defineField({ name: 'duration', title: 'Duration', type: 'string', description: 'e.g. "~30 min"' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'price' },
            prepare({ title, subtitle }) {
              return { title, subtitle: subtitle ? `+$${subtitle}` : '' };
            },
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
