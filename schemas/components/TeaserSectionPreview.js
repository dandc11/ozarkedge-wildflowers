import { useMemo } from 'react'
import { Flex, Grid, Card, Text, Heading, Box } from '@sanity/ui'
import { useClient } from 'sanity'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText } from '@portabletext/react'

/**
 * Builds a thumbnail URL from a Sanity image source using the Studio client.
 * @param {import('@sanity/image-url').ImageUrlBuilder} builder
 * @param {object} source - A Sanity image object with asset._ref
 * @param {number} [width=200]
 * @param {number} [height=150]
 * @returns {string|null}
 */
const buildThumbUrl = (builder, source, width = 200, height = 150) => {
  if (!source?.asset?._ref) return null
  try {
    return builder.image(source).width(width).height(height).fit('crop').auto('format').url()
  } catch {
    return null
  }
}

/**
 * Minimal portable text components for Studio preview context.
 * Text-only rendering — no images, videos, or interactive blocks.
 */
const previewPortableTextComponents = {
  block: {
    normal: ({ children }) => <p style={{ margin: '4px 0' }}>{children}</p>,
    h2: ({ children }) => <p style={{ margin: '4px 0', fontWeight: 'bold' }}>{children}</p>,
    h3: ({ children }) => <p style={{ margin: '4px 0', fontWeight: 'bold' }}>{children}</p>,
    h4: ({ children }) => <p style={{ margin: '4px 0', fontWeight: 'bold' }}>{children}</p>,
    blockquote: ({ children }) => (
      <p style={{ margin: '4px 0', fontStyle: 'italic', paddingLeft: 8 }}>{children}</p>
    ),
  },
  // Skip non-text block types in preview
  types: {
    figure: () => null,
    imageCollection: () => null,
    portTextVideo: () => null,
    teaserSection: () => null,
  },
}

/**
 * Renders a grid of image thumbnails using @sanity/image-url.
 * @param {object} props
 * @param {import('@sanity/image-url').ImageUrlBuilder} props.builder
 * @param {Array} props.images - Array of figure/image objects
 */
const ImageThumbnailGrid = ({ builder, images }) => {
  if (!images?.length && !images?.asset) return null

  // Handle single image object (from feature.js) vs array (from teaserSection.js)
  const imageArray = Array.isArray(images) ? images : [images]
  if (imageArray.length === 0) return null

  return (
    <Grid columns={2} gap={2} padding={2}>
      {imageArray.slice(0, 12).map((image, index) => {
        const url = buildThumbUrl(builder, image)
        const key = image?._key || image?.asset?._ref || index
        return (
          <Card key={key} tone="default" radius={2} style={{ overflow: 'hidden' }}>
            {url ? (
              <img
                src={url}
                alt={image?.alt || ''}
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                  borderRadius: 4,
                }}
              />
            ) : (
              <Card
                tone="transparent"
                padding={3}
                style={{ aspectRatio: '4/3', display: 'grid', placeItems: 'center' }}
              >
                <Text size={1} muted>
                  No image
                </Text>
              </Card>
            )}
            {image?.caption && (
              <Text size={0} muted style={{ padding: '4px 6px' }}>
                {image.caption}
              </Text>
            )}
          </Card>
        )
      })}
    </Grid>
  )
}

/**
 * Studio preview component for the TeaserSection block type.
 * Used in portable text and the feature object type.
 * Only depends on @sanity/ui, @sanity/image-url, and @portabletext/react
 * so it works in both embedded and Sanity-hosted Studio.
 *
 * @param {object} props
 * @param {Array} props.images - Image(s) for the teaser (array or single object)
 * @param {string} props.title - The title of the teaser section
 * @param {Array} props.bodyText - Portable text body content
 * @param {object} props.link - Reference to the linked page
 * @returns {JSX.Element}
 */
export const TeaserSectionPreview = (props) => {
  const { title, images, bodyText, link } = props
  const client = useClient({ apiVersion: '2024-10-28' })
  const builder = useMemo(() => imageUrlBuilder(client), [client])

  return (
    <Card tone="positive">
      <Flex padding={2} direction="column" justify="center">
        <Heading padding={8} marginBottom={4} as="h5" size={1}>
          <strong>Teaser Section: </strong>
        </Heading>
        <br />
        <Heading padding={4} as="h2" size={3}>
          <strong>{title}</strong>
        </Heading>
        {bodyText && (
          <Box padding={3}>
            <PortableText value={bodyText} components={previewPortableTextComponents} />
          </Box>
        )}
        <ImageThumbnailGrid builder={builder} images={images} />
      </Flex>
    </Card>
  )
}
