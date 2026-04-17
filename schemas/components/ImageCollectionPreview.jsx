import { useMemo } from 'react'
import { Flex, Grid, Card, Text, Heading } from '@sanity/ui'
import { useClient } from 'sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

/**
 * Builds a thumbnail URL from a Sanity image source using the Studio client.
 * @param {import('@sanity/image-url').ImageUrlBuilder} builder - The image URL builder instance
 * @param {object} source - A Sanity image object with asset._ref
 * @param {number} [width=200] - Thumbnail width
 * @param {number} [height=150] - Thumbnail height
 * @returns {string|null} The image URL, or null if the source is invalid
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
 * Studio preview component for the ImageCollection block type.
 * Used in portable text. Only depends on @sanity/ui and @sanity/image-url
 * so it works in both embedded and Sanity-hosted Studio.
 *
 * @param {object} props
 * @param {Array} props.collection - Array of figure objects from the imageCollection field
 * @returns {JSX.Element}
 */
export const ImageCollectionPreview = (props) => {
  const { collection } = props
  const client = useClient({ apiVersion: '2024-10-28' })
  const builder = useMemo(() => createImageUrlBuilder(client), [client])

  return (
    <Card tone="positive">
      <Flex padding={2} direction="column" justify="center">
        <Heading padding={4} as="h5" size={1}>
          Image Collection
          {collection?.length ? (
            <Text size={1} muted style={{ display: 'inline', marginLeft: 8 }}>
              ({collection.length} {collection.length === 1 ? 'image' : 'images'})
            </Text>
          ) : null}
        </Heading>
        {collection?.length > 0 ? (
          <Grid columns={2} gap={2} padding={2}>
            {collection.slice(0, 12).map((image, index) => {
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
        ) : (
          <Text size={1} muted padding={3}>
            No images added yet.
          </Text>
        )}
      </Flex>
    </Card>
  )
}
