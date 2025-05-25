import { defineArrayMember, defineType } from 'sanity'
import { AiOutlineCamera } from 'react-icons/ai'

export default defineType({
  name: 'portTextVideo',
  title: 'Video',
  type: 'object',
  fields: [
    { title: 'Video Title', name: 'title', type: 'string' },
    {
      title: 'Video file',
      name: 'video',
      type: 'mux.video',
    },
    {
      name: 'useTitleAsCaption',
      title: 'Use Video Title As Caption / Alt Text',
      hidden: ({ parent }) => !parent?.video,
      type: 'boolean',
      description: 'Select to use the video title for the caption and alt text.',
    },
    {
      name: 'caption',
      hidden: ({ parent }) => !parent?.video || parent?.useTitleAsCaption,
      title: 'Caption',
      type: 'string',
    },
    {
      name: 'alt',
      hidden: ({ parent }) => !parent?.video || parent?.useTitleAsCaption,
      title: 'Alt Text',
      type: 'string',
    },
  ],
  icon: () => '🎥 ',
  preview: {
    select: {
      media: 'video',
      title: 'title', // Assuming you have a title field
    },
    prepare(selection) {
      const { video, title } = selection
      return {
        title: title || 'Untitled',
        media: video, // The Mux plugin should handle rendering the thumbnail
      }
    },
  },
})
