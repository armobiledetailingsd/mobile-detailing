import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description: 'Overrides the default page title in browser tabs and search results.',
      validation: (Rule) => Rule.max(60).warning('Keep meta titles under 60 characters.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('Keep meta descriptions under 160 characters.'),
    }),
    defineField({
      name: 'openGraphImage',
      title: 'Open Graph image',
      type: 'image',
      description: 'Image used when this page is shared on social media.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description: 'When enabled, adds a `noindex` meta tag.',
      initialValue: false,
    }),
  ],
});
