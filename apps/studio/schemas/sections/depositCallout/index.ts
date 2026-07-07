import { defineArrayMember, defineField, defineType } from 'sanity';
import { CreditCardIcon } from '@sanity/icons';

const ICON_OPTIONS = [
  'phone', 'map-pin', 'navigation', 'clock', 'wrench', 'check', 'check-circle',
  'arrow-right', 'star', 'shield', 'truck', 'alert-triangle', 'dollar-sign', 'message', 'gauge',
].map((v) => ({ title: v, value: v }));

export const depositCallout = defineType({
  name: 'depositCallout',
  title: 'Deposit Callout',
  type: 'object',
  icon: CreditCardIcon,
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
      name: 'depositAmount',
      title: 'Deposit amount',
      type: 'string',
      description: 'Displayed large, e.g. "$70"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'depositLabel',
      title: 'Deposit label',
      type: 'string',
      description: 'Small label above the amount',
    }),
    defineField({
      name: 'depositNote',
      title: 'Deposit note',
      type: 'text',
      rows: 2,
      description: 'Fine print below the amount',
    }),
    defineField({
      name: 'reasons',
      title: 'Reasons deposit applies',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'depositReason',
          fields: [
            defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: ICON_OPTIONS } }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
          ],
          preview: {
            select: { title: 'title' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return { title: 'Deposit Callout', subtitle: heading ?? '' };
    },
  },
});
