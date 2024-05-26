// ./schema/offer/OfferPreview.tsx

import { Flex, Box, Grid, Card, Text, Heading } from '@sanity/ui'

// JS Docs
/**
 * @param {object} props
 * @param {object} props.collection
 * This is a preview component for the ImageCollection block type. Used in portable text.
 * @returns {JSX.Element}
 */
export const VideoPreview = (props) => {
  const { title } = props
  return (
    <Card tone='positive'>
      <Flex padding={2} direction={'column'} justify={'center'}>
        <Heading padding={4} as="h5" size={1}>
          Video 
        </Heading>
      </Flex>
    </Card>
  )
}