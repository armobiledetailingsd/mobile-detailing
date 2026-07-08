import { defineArrayMember, defineField, defineType } from 'sanity';
import { ImagesIcon } from '@sanity/icons';

const ASPECT_OPTIONS = [
  { title: '4:3', value: '4/3' },
  { title: '16:9', value: '16/9' },
];

export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'object',
  icon: ImagesIcon,
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
      name: 'items',
      title: 'Gallery items',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'galleryItem',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({
              name: 'aspect',
              title: 'Aspect ratio',
              type: 'string',
              options: { list: ASPECT_OPTIONS, layout: 'radio' },
              initialValue: '4/3',
            }),
          ],
          preview: {
            select: { title: 'label', media: 'image' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return { title: 'Gallery', subtitle: heading ?? '' };
    },
  },
});
