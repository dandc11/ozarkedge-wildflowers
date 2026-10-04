import imageUrlBuilder from '@sanity/image-url'
import { Box, Card, Container, Heading, Stack, Text } from '@sanity/ui'
import { PortableText } from '@portabletext/react'
import { useClient } from 'sanity'

/**
 * Read view for `studioGuide` documents.
 *
 * These guides are read-only, so the Portable Text *editor* is the wrong tool for
 * them: it renders in a narrow column with a toolbar the reader cannot use, and
 * getting a readable width means discovering the field's "expand editor" control.
 * This renders the guide as a document instead, and is registered as the default
 * view in sanity.config.js so reading takes no discovery at all. The form is still
 * available on the second tab.
 */

const GuideImage = ({ value }) => {
  const client = useClient({ apiVersion: '2024-10-28' })

  if (!value?.asset?._ref) return null

  const url = imageUrlBuilder(client).image(value).width(1200).fit('max').auto('format').url()

  return (
    <Box marginY={4}>
      <img
        src={url}
        alt={value.alt || ''}
        style={{ maxWidth: '100%', height: 'auto', borderRadius: 4, display: 'block' }}
      />
    </Box>
  )
}

const components = {
  types: {
    figure: GuideImage,
  },
  block: {
    h2: ({ children }) => (
      <Box marginTop={5} marginBottom={3}>
        <Heading size={3}>{children}</Heading>
      </Box>
    ),
    h3: ({ children }) => (
      <Box marginTop={4} marginBottom={2}>
        <Heading size={1}>{children}</Heading>
      </Box>
    ),
    h4: ({ children }) => (
      <Box marginTop={4} marginBottom={2}>
        <Heading size={0}>{children}</Heading>
      </Box>
    ),
    blockquote: ({ children }) => (
      <Card marginY={4} padding={4} radius={2} tone="caution" border>
        <Text size={2}>{children}</Text>
      </Card>
    ),
    normal: ({ children }) => (
      <Box marginY={3}>
        <Text size={2} style={{ lineHeight: 1.6 }}>
          {children}
        </Text>
      </Box>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <Box marginY={3} paddingLeft={4}>
        <Stack as="ul" space={3}>
          {children}
        </Stack>
      </Box>
    ),
    number: ({ children }) => (
      <Box marginY={3} paddingLeft={4}>
        <Stack as="ol" space={3}>
          {children}
        </Stack>
      </Box>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <Text as="li" size={2} style={{ lineHeight: 1.6, listStyle: 'disc' }}>
        {children}
      </Text>
    ),
    number: ({ children }) => (
      <Text as="li" size={2} style={{ lineHeight: 1.6, listStyle: 'decimal' }}>
        {children}
      </Text>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    externalLink: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
}

export function StudioGuideView(props) {
  const doc = props?.document?.displayed

  if (!doc?.body?.length) {
    return (
      <Card padding={5}>
        <Text muted>This guide has no content yet.</Text>
      </Card>
    )
  }

  return (
    <Card padding={[4, 4, 5]} height="fill" overflow="auto">
      <Container width={1}>
        <Box marginBottom={5}>
          <Heading size={5}>{doc.title}</Heading>
        </Box>
        <PortableText value={doc.body} components={components} />
      </Container>
    </Card>
  )
}
