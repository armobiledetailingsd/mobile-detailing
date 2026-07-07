import { defineArrayMember, defineField, defineType } from 'sanity';
import { DocumentsIcon } from '@sanity/icons';

export const websitePage = defineType({
  name: 'websitePage',
  title: 'Website Page',
  type: 'document',
  icon: DocumentsIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal label for this page. Not displayed publicly.',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path for this page. Use `homepage` for the root.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      description: 'Page sections. Add, remove, and reorder to build the page.',
      of: [
          defineArrayMember({ type: 'richText' }),
          defineArrayMember({ type: 'heroSection' }),
          defineArrayMember({ type: 'trustBar' }),
          defineArrayMember({ type: 'servicesSection' }),
          defineArrayMember({ type: 'howItWorks' }),
          defineArrayMember({ type: 'reviewsSection' }),
          defineArrayMember({ type: 'coverageSection' }),
          defineArrayMember({ type: 'depositCallout' }),
          defineArrayMember({ type: 'smsBanner' }),
        ],
      group: 'content',
    }),
    defineField({
      name: 'pageSettings',
      title: 'Page settings',
      type: 'pageSettings',
      group: 'settings',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      media: 'seo.openGraphImage',
    },
    prepare({ title, slug, media }) {
      return {
        title: title ?? 'Untitled page',
        subtitle: slug ? `/${slug}` : 'No slug set',
        media,
      };
    },
  },
});
