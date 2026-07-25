import {
  GiCompass,
  GiHouse,
  GiOakLeaf,
  GiFlowers,
  GiSasquatch,
  GiHamburgerMenu,
  GiGears,
} from 'react-icons/gi'
import { MdArticle } from 'react-icons/md'

// Document types locked to a single, fixed-ID document via Studio Structure.
// Add a type here once it should no longer be creatable/duplicatable from the generic list.
// Note: this filtering plus the `duplicate` action block in sanity.config.js together cover
// Studio's UI entry points, but neither prevents a second document from being created via
// Vision or the API directly — accepted as a low-risk limitation for a solo-editor site.
const SINGLETONS = [
  'welcomeSection',
  'landingPage',
  'aboutPage',
  'plantListPage',
  'notFoundPage',
  'siteSettings',
  'menu',
]

// Unlike welcomeSection, these singletons weren't created with a fixed _id matching
// their type name — they have ordinary auto-generated ids. Resolve the real id at
// Studio load time instead of hardcoding one, so we open the existing document
// rather than creating a stray duplicate at `documentId(type)`.
const singletonItem = (S, context, { type, title, icon }) =>
  S.listItem()
    .id(type)
    .title(title)
    .icon(icon)
    .child(() =>
      context
        .getClient({ apiVersion: '2024-10-28' })
        .fetch(`*[_type == $type][0]._id`, { type })
        .then((id) => S.document().schemaType(type).documentId(id || type).title(title)),
    )

export const structure = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Welcome Section')
        .icon(GiCompass)
        .child(
          S.document()
            .schemaType('welcomeSection')
            .documentId('welcomeSection')
            .title('Welcome Section'),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => !SINGLETONS.includes(listItem.getId())),
      S.divider(),
      S.listItem()
        .title('Pages')
        .icon(MdArticle)
        .child(
          S.list()
            .title('Pages')
            .items([
              singletonItem(S, context, {
                type: 'landingPage',
                title: 'Landing Page',
                icon: GiHouse,
              }),
              singletonItem(S, context, {
                type: 'aboutPage',
                title: 'About Page',
                icon: GiOakLeaf,
              }),
              singletonItem(S, context, {
                type: 'plantListPage',
                title: 'Plant List Page',
                icon: GiFlowers,
              }),
              singletonItem(S, context, {
                type: 'notFoundPage',
                title: '404 Page',
                icon: GiSasquatch,
              }),
            ]),
        ),
      S.divider(),
      singletonItem(S, context, { type: 'siteSettings', title: 'Site Settings', icon: GiGears }),
      singletonItem(S, context, { type: 'menu', title: 'Menu', icon: GiHamburgerMenu }),
    ])
