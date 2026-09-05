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

import { StudioGuideView } from '../../schemas/components/StudioGuideView'

// Document types kept out of the generic `documentTypeListItems()` list below,
// for one of two reasons:
//   1. Singletons — locked to a single, fixed-ID document via Studio Structure, so
//      they should not be creatable/duplicatable from the generic list.
//   2. Types given a deliberate home elsewhere in this file (the Studio-only help
//      documentation), so they don't sit alongside site content.
// Note: for the singletons, this filtering plus the `duplicate` action block in
// sanity.config.js together cover Studio's UI entry points, but neither prevents a
// second document from being created via Vision or the API directly — accepted as a
// low-risk limitation for a solo-editor site.
const HIDDEN_FROM_AUTO_LIST = [
  'welcomeSection',
  'landingPage',
  'aboutPage',
  'plantListPage',
  'notFoundPage',
  'siteSettings',
  'menu',
  'studioGuide',
  'studioNote',
]

// Unlike welcomeSection, these singletons weren't created with a fixed _id matching
// their type name — they have ordinary auto-generated ids. Resolve the real id at
// Studio load time instead of hardcoding one, so we open the existing document
// rather than creating a stray duplicate at `documentId(type)`. Excluding drafts.**
// keeps the lookup on the published base id — S.document().documentId() expects
// that base id and overlays the draft itself, so a raw drafts.<id> would target
// the wrong document.
const singletonItem = (S, context, { type, title, icon }) =>
  S.listItem()
    .id(type)
    .title(title)
    .icon(icon)
    .child(() =>
      context
        .getClient({ apiVersion: '2024-10-28' })
        .fetch(`*[_type == $type && !(_id in path("drafts.**"))][0]._id`, { type })
        .then((id) =>
          S.document()
            .schemaType(type)
            .documentId(id || type)
            .title(title),
        ),
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
      ...S.documentTypeListItems().filter(
        (listItem) => !HIDDEN_FROM_AUTO_LIST.includes(listItem.getId()),
      ),
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
      S.divider(),
      // Studio-only help documentation. Guides are read-only (see the studioGuide
      // document actions in sanity.config.js); notes are the editor's own space.
      S.listItem()
        .id('studioGuide')
        .title('📘 Help & Guides')
        .child(
          S.documentTypeList('studioGuide')
            .title('Help & Guides')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
            // A document-type list infers its own create templates and reads them
            // directly, so it never consults document.newDocumentOptions. Clearing
            // them is what actually removes this pane's "+" button.
            .initialValueTemplates([]),
        ),
      S.listItem()
        .id('studioNote')
        .title('✏️ Learnings & Notes')
        .child(S.documentTypeList('studioNote').title('Learnings & Notes')),
    ])

/**
 * Opens `studioGuide` documents on a rendered, full-width read view rather than the
 * Portable Text editor. The guides are read-only, so the editor is the wrong surface
 * for them: it renders in a narrow column behind a toolbar the reader cannot use, and
 * a readable width is only reachable via the field's "expand editor" control. Making
 * the read view the first view makes it the default. The form stays on the second tab.
 */
export const defaultDocumentNode = (S, { schemaType }) => {
  if (schemaType === 'studioGuide') {
    return S.document().views([
      S.view.component(StudioGuideView).title('Guide').id('guide'),
      S.view.form().title('Fields'),
    ])
  }

  return S.document().views([S.view.form()])
}
