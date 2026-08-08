import { defineArrayMember, defineField, defineType } from 'sanity';
import { HelpCircleIcon } from '@sanity/icons';

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
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
      title: 'Questions',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'question' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return { title: 'FAQ', subtitle: heading ?? '' };
    },
  },
});
