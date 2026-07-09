import { defineArrayMember, defineField, defineType } from 'sanity';
import { RocketIcon } from '@sanity/icons';
import { ICON_OPTIONS } from '../../shared/iconOptions';

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'headlineMain',
      title: 'Headline (main line)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headlineAccent',
      title: 'Headline (accent line)',
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
      name: 'trustMarkers',
      title: 'Trust markers',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trustMarker',
          fields: [
            defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: ICON_OPTIONS } }),
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { headline: 'headlineMain' },
    prepare({ headline }) {
      return { title: 'Hero', subtitle: headline ?? '' };
    },
  },
});
