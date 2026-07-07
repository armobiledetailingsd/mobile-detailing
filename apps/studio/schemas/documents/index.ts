import { blogPost } from './blogPost';
import { footerNavigation } from './footerNavigation';
import { headerNavigation } from './headerNavigation';
import { redirect } from './redirect';
import { siteSettings } from './siteSettings';
import { websitePage } from './websitePage';

export const documentTypes = [
  websitePage,
  blogPost,
  siteSettings,
  headerNavigation,
  footerNavigation,
  redirect,
];
