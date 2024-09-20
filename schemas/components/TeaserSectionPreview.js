// ./schema/offer/OfferPreview.tsx

import { Flex, Box, Grid, Card, Text, Heading } from '@sanity/ui'
import Image from 'next/image'

import ThumbnailGrid from '../../components/ThumbnailGrid'
import PortTextWrapper from '../../components/PortTextWrapper'

// JS Docs
/**
 * @param {object} props
 * @param {object} props.images - An array of images to be displayed in the teaser section.
 * @param {string} props.title - The title of the teaser section.
 * @param {string} props.bodyText - The body text of the teaser section.
 * @param {object} props.link - The link to the page that the teaser section should direct the visitor toward.
 *
 * This is a preview component for the TeaserSection block type. Used in portable text and elsewhere.
 * @returns {JSX.Element}
 */
export const TeaserSectionPreview = (props) => {
  const { title, images, bodyText, link } = props
  return (
    <Card tone="positive">
      <Flex padding={2} direction={'column'} justify={'center'}>
        <Heading padding={8} marginBottom={4} as="h5" size={1}>
          <strong>Teaser Section: </strong>
        </Heading>
          <br></br>
        <Heading padding={4} as="h2" size={3}>
          <strong>{title}</strong>
        </Heading>
        {bodyText && (
          <>
            <br></br>
            <PortTextWrapper value={bodyText} />
            <br></br>
          </>
        )}
        {images ? (
          <ThumbnailGrid
            assets={images}
            className={`my-7 bp-900:mx-6 bp-1200:mx-10`}
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
