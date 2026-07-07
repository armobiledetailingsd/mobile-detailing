import type { StructureResolver } from 'sanity/structure';
import {
  CogIcon,
  ComposeIcon,
  DocumentsIcon,
  EditIcon,
  HomeIcon,
  MasterDetailIcon,
  MenuIcon,
  ThListIcon,
  TransferIcon,
} from '@sanity/icons';

// Documents pinned by ID — these power the singleton entries in the structure.
// Keep these IDs stable; they are referenced from the structure and may be
// referenced from migrations or scripts in the future.
export const SINGLETON_IDS = {
  homepage: 'siteHomepage',
  siteSettings: 'siteSettings',
  headerNavigation: 'headerNavigation',
  footerNavigation: 'footerNavigation',
} as const;

const SINGLETON_ID_LIST = Object.values(SINGLETON_IDS);

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Website Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Website Pages')
            .items([
              S.listItem()
                .title('Homepage')
                .icon(HomeIcon)
                .child(S.document().schemaType('websitePage').documentId(SINGLETON_IDS.homepage)),
              S.divider(),
              S.listItem()
                .title('All Pages')
                .icon(MasterDetailIcon)
                .child(
                  S.documentTypeList('websitePage')
                    .title('All Pages')
                    .filter('_type == "websitePage" && !(_id in $singletons)')
                    .params({ singletons: SINGLETON_ID_LIST }),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Blog Posts')
        .icon(EditIcon)
        .schemaType('blogPost')
        .child(
          S.documentTypeList('blogPost')
            .title('Blog Posts')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
        ),
      S.divider(),
      S.listItem()
        .title('Global Content')
        .icon(ComposeIcon)
        .child(
          S.list()
            .title('Global Content')
            .items([
              S.listItem()
                .title('Header Navigation')
                .icon(MenuIcon)
                .child(
                  S.document()
                    .schemaType('headerNavigation')
                    .documentId(SINGLETON_IDS.headerNavigation),
                ),
              S.listItem()
                .title('Footer Navigation')
                .icon(ThListIcon)
                .child(
                  S.document()
                    .schemaType('footerNavigation')
                    .documentId(SINGLETON_IDS.footerNavigation),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Redirects')
        .icon(TransferIcon)
        .schemaType('redirect')
        .child(S.documentTypeList('redirect').title('Redirects')),
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId(SINGLETON_IDS.siteSettings)),
    ]);
