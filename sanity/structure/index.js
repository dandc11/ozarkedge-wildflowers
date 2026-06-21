import { GiCompass } from 'react-icons/gi'

// Document types locked to a single, fixed-ID document via Studio Structure.
// Add a type here once it should no longer be creatable/duplicatable from the generic list.
// Note: this filtering plus the `duplicate` action block in sanity.config.js together cover
// Studio's UI entry points, but neither prevents a second document from being created via
// Vision or the API directly — accepted as a low-risk limitation for a solo-editor site.
const SINGLETONS = ['welcomeSection']

export const structure = (S) =>
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
        (listItem) => !SINGLETONS.includes(listItem.getId()),
      ),
    ])
