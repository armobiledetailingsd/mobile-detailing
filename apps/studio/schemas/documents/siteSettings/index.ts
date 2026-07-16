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
