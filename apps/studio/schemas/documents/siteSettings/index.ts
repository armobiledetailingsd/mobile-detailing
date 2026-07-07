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
  ],
  preview: {
    select: { title: 'siteName' },
    prepare({ title }) {
      return { title: title ?? 'Site Settings' };
    },
  },
});
