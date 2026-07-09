import { defineArrayMember, defineField, defineType } from 'sanity';
import { StarIcon } from '@sanity/icons';
import { ICON_OPTIONS } from '../../shared/iconOptions';

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
