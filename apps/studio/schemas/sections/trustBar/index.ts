import { defineArrayMember, defineField, defineType } from 'sanity';
import { StarIcon } from '@sanity/icons';

const ICON_OPTIONS = [
  'phone', 'map-pin', 'navigation', 'clock', 'wrench', 'check', 'check-circle',
  'arrow-right', 'star', 'shield', 'truck', 'alert-triangle', 'dollar-sign', 'message', 'gauge',
].map((v) => ({ title: v, value: v }));

export const trustBar = defineType({
  name: 'trustBar',
  title: 'Trust Bar',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trustBarItem',
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
    prepare() {
      return { title: 'Trust Bar' };
    },
  },
});
