// ./schema/offer/OfferPreview.tsx

import { Flex, Box, Grid, Card, Text, Heading } from '@sanity/ui'
import Image from 'next/image'

import ThumbnailGrid from '../../components/ThumbnailGrid'

// JS Docs
/**
 * @param {object} props
 * @param {object} props.collection
 * This is a preview component for the ImageCollection block type. Used in portable text.
 * @returns {JSX.Element}
 */
export const ImageCollectionPreview = (props) => {
  const { collection } = props
  return (
    <Card tone="positive">
      <Flex padding={2} direction={'column'} justify={'center'}>
        <Heading padding={4} as="h5" size={1}>
          Image Collection
        </Heading>
        {collection ? (
          <ThumbnailGrid
            assets={collection}
            className={`img-collection m-bk-md`}
            cols={2}
            maxItems={12}
            lightboxIdentifier={''}
            onClick={() => {}}
            showCaptions
          />
        ) : null}
      </Flex>
    </Card>
  )
}
