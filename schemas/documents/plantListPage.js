import { GiFlowers } from 'react-icons/gi'
import {
  defineArrayMember,
  defineType,
  defineField,
  defineConfig,
} from 'sanity'

export default defineConfig({
  name: 'plantListPage',
  title: 'Native Wildflowers List Page',
  icon: GiFlowers,
  type: 'document',
  liveEdit: false,
  // You probably want to uncomment the next line once you've made the pages documents in the Studio. This will remove the pages document type from the create-menus.
  __experimental_actions: ['update', 'publish' /* 'create', 'delete' */],
  fields: [
    defineField({
      name: 'titleText',
      title: 'Plant List Page Title',
      description: "This is the text for this page's main heading.",
      type: 'string',
    }),
    defineField({
      name: 'plantListInformation',
      title: 'Plant List Information',
      description: 'Add the body text for the plant list page here.',
      type: 'pageBodyPortableText',
    }),
    defineField({
      name: 'plantList',
      title: 'plantList',
      type: 'array',
      hidden: true,
      of: [{ type: 'nativePlant' }],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description:
        'The URL slug for this page (read-only since changing will break links under this path).',
      readOnly: true,
    }),
  ],
})
