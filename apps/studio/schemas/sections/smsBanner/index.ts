import { defineField, defineType } from 'sanity';
import { MobileDeviceIcon } from '@sanity/icons';

export const smsBanner = defineType({
  name: 'smsBanner',
  title: 'SMS Banner',
  type: 'object',
  icon: MobileDeviceIcon,
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'string',
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone number (href)',
      type: 'string',
      description: 'Used in sms: link. E.164 format preferred: +12035550148. 10-digit US numbers (2035550148) are also accepted.',
      validation: (Rule) =>
        Rule.required().regex(/^\+?1?\d{10}$|^\+\d{7,15}$/, {
          name: 'phone number',
          invert: false,
        }),
    }),
    defineField({
      name: 'phoneDisplay',
      title: 'Phone number (display)',
      type: 'string',
      description: 'Formatted for display, e.g. (203) 555-0148',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { headline: 'headline' },
    prepare({ headline }) {
      return { title: 'SMS Banner', subtitle: headline ?? '' };
    },
  },
});
