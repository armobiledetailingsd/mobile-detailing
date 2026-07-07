import { defineField, defineType } from 'sanity';

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal page', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'internalReference',
      title: 'Internal reference',
      type: 'reference',
      to: [{ type: 'websitePage' }],
      hidden: ({ parent }) => parent?.linkType !== 'internal',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { linkType?: string } | undefined;
          if (parent?.linkType === 'internal' && !value) {
            return 'Pick a page to link to.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      // Plain string, not `url`: the url type's intrinsic validation rejects
      // site-relative paths (/blog) and anchors (#services), which the
      // frontend supports.
      type: 'string',
      description: 'Full URL (https://…), site-relative path (/blog), or anchor (#services).',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { linkType?: string } | undefined;
          if (parent?.linkType !== 'external') return true;
          if (!value) {
            return 'Enter a full URL (https://…), a relative path (/page), or an anchor (#section).';
          }
          if (value.startsWith('/') || value.startsWith('#')) return true;
          try {
            const protocol = new URL(value).protocol;
            return ['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)
              ? true
              : 'Only http(s), mailto: or tel: URLs are allowed.';
          } catch {
            return 'Enter a full URL (https://…), a relative path (/page), or an anchor (#section).';
          }
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
