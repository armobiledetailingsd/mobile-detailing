import type { DefaultDocumentNodeResolver, StructureResolver } from 'sanity/structure';
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
import { PagePreview } from './components/PagePreview';

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

// Shared Editor/Preview view pair for websitePage documents. Applied both via
// defaultDocumentNode (for documentTypeList items, e.g. All Pages) and
// explicitly on any S.document() built directly in the structure below —
// an explicit S.document() fully defines its own node and does not fall
// through to defaultDocumentNode.
const websitePageViews = (S: Parameters<DefaultDocumentNodeResolver>[0]) => [
  S.view.form(),
  S.view.component(PagePreview).title('Preview'),
];

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  if (schemaType === 'websitePage') {
    return S.document().views(websitePageViews(S));
  }
  return S.document();
};

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
                .child(
                  S.document()
                    .schemaType('websitePage')
                    .documentId(SINGLETON_IDS.homepage)
                    .views(websitePageViews(S)),
                ),
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
