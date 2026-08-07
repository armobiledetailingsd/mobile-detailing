import { defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'metadata', title: 'Metadata', default: true },
    { name: 'organization', title: 'Organization' },
    { name: 'features', title: 'Features' },
    { name: 'booking', title: 'Booking' },
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      description: 'Used in the browser tab and as a fallback title.',
      validation: (Rule) => Rule.required(),
      group: 'metadata',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Brand mark shown in the site header and footer. Falls back to a letter avatar when empty.',
      options: { hotspot: true },
      group: 'metadata',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site description',
      type: 'text',
      rows: 3,
      description: 'Default meta description for pages that don’t set their own.',
      group: 'metadata',
    }),
    defineField({
      name: 'defaultOpenGraphImage',
      title: 'Default Open Graph image',
      type: 'image',
      description: 'Fallback social-share image (1200×630 recommended).',
      options: { hotspot: true },
      group: 'metadata',
    }),
    defineField({
      name: 'organizationLegalName',
      title: 'Legal name',
      type: 'string',
      group: 'organization',
    }),
    defineField({
      name: 'organizationUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'e.g. https://www.example.com',
      group: 'organization',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'email',
      group: 'organization',
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone number (href)',
      type: 'string',
      description: 'E.164 format for tel:/sms: links, e.g. +14155551234. Used site-wide in the header, footer, and legal pages.',
      validation: (Rule) =>
        Rule.regex(/^\+[1-9]\d{1,14}$/, {
          name: 'phone number',
          invert: false,
        }).error('Must be E.164 format, e.g. +14155551234 — no spaces, parens, or dashes.'),
      group: 'organization',
    }),
    defineField({
      name: 'phoneDisplay',
      title: 'Phone number (display)',
      type: 'string',
      description: 'Formatted for display, e.g. (415) 555-1234.',
      group: 'organization',
    }),
    defineField({
      name: 'businessHours',
      title: 'Business hours',
      type: 'string',
      description: 'Shown in the site footer, e.g. Mon–Sat, 8am–5pm.',
      group: 'organization',
    }),
    defineField({
      name: 'socialFacebookUrl',
      title: 'Facebook URL',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
      group: 'organization',
    }),
    defineField({
      name: 'socialInstagramUrl',
      title: 'Instagram URL',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
      group: 'organization',
    }),
    defineField({
      name: 'blogEnabled',
      title: 'Blog enabled',
      type: 'boolean',
      description:
        'Kill switch for the blog. When off, /blog and all post pages return 404 and posts drop out of the sitemap. Post content is kept in Sanity.',
      initialValue: true,
      group: 'features',
    }),
    defineField({
      name: 'calendlyUrlBronze',
      title: 'Calendly URL — Bronze (~1.5 hr)',
      type: 'url',
      description:
        'Public Calendly link for the Bronze Detail event type, e.g. https://calendly.com/your-team/bronze-detail. Leave blank to hide this package on the book page until it is ready.',
      validation: (Rule) =>
        Rule.uri({ scheme: ['https'] }).custom((value) => {
          if (!value) return true;
          try {
            const { hostname } = new URL(value);
            return hostname === 'calendly.com' || hostname.endsWith('.calendly.com')
              ? true
              : 'Must be a calendly.com URL';
          } catch {
            return 'Must be a valid URL';
          }
        }),
      group: 'booking',
    }),
    defineField({
      name: 'calendlyUrlSilver',
      title: 'Calendly URL — Silver (~3 hr)',
      type: 'url',
      description:
        'Public Calendly link for the Silver Detail event type, e.g. https://calendly.com/your-team/silver-detail. Leave blank to hide this package on the book page until it is ready.',
      validation: (Rule) =>
        Rule.uri({ scheme: ['https'] }).custom((value) => {
          if (!value) return true;
          try {
            const { hostname } = new URL(value);
            return hostname === 'calendly.com' || hostname.endsWith('.calendly.com')
              ? true
              : 'Must be a calendly.com URL';
          } catch {
            return 'Must be a valid URL';
          }
        }),
      group: 'booking',
    }),
    defineField({
      name: 'calendlyUrlGold',
      title: 'Calendly URL — Gold (~4.5 hr)',
      type: 'url',
      description:
        'Public Calendly link for the Gold Detail event type, e.g. https://calendly.com/your-team/gold-detail. Leave blank to hide this package on the book page until it is ready.',
      validation: (Rule) =>
        Rule.uri({ scheme: ['https'] }).custom((value) => {
          if (!value) return true;
          try {
            const { hostname } = new URL(value);
            return hostname === 'calendly.com' || hostname.endsWith('.calendly.com')
              ? true
              : 'Must be a calendly.com URL';
          } catch {
            return 'Must be a valid URL';
          }
        }),
      group: 'booking',
    }),
    defineField({
      name: 'stripeDepositLink',
      title: 'Stripe deposit Payment Link',
      type: 'url',
      description:
        'Stripe Payment Link for the flat booking deposit, e.g. https://buy.stripe.com/xxxx',
      validation: (Rule) => Rule.required().uri({ scheme: ['https'] }),
      group: 'booking',
    }),
  ],
  preview: {
    select: { title: 'siteName' },
    prepare({ title }) {
      return { title: title ?? 'Site Settings' };
    },
  },
});
