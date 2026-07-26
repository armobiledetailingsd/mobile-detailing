import { defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';

export const aboutSection = defineType({
  name: 'aboutSection',
  title: 'About / Founder Story',
  type: 'object',
  icon: UserIcon,
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
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'founderName',
      title: 'Founder name',
      type: 'string',
    }),
    defineField({
      name: 'founderTitle',
      title: 'Founder title',
      type: 'string',
      description: 'e.g. Owner & Founder',
    }),
    defineField({
      name: 'foundedYear',
      title: 'Founded year',
      type: 'number',
    }),
    defineField({
      name: 'yearsExperience',
      title: 'Years of experience',
      type: 'number',
    }),
  ],
  preview: {
    select: { heading: 'heading', subtitle: 'founderName' },
    prepare({ heading, subtitle }) {
      return { title: 'About / Founder Story', subtitle: heading ?? subtitle ?? '' };
    },
  },
});
