import groq from 'groq'

import { client } from '../../app/lib/sanity.client'
import { getPathFromDocType } from '../../utilities/helperUtil'
import { readToken } from '../../app/lib/sanity.api'

// Enable Preview Mode - https://nextjs.org/docs/pages/building-your-application/configuring/draft-mode
// TODO: Consider adding a preview secret check. Currently, anyone with the preview URL can access the preview. There is little risk in this, but it is not ideal.  See https://www.sanity.io/docs/preview-content-on-site
export default async function preview(req, res) {
  if (!readToken) {
    res.status(500).send('Misconfigured server')
    return
  }
  const docQuery = groq`*[slug.current == $slug][0]`

  const { query } = req
  const slug = typeof query.slug === 'string' ? query.slug : undefined

  // Rather than redirect to any passed slug, check the slug against existing documents
  if (slug) {
    const getDoc = async function (slug) {
      return await client.fetch(docQuery, {
        slug,
      })
    }

    const doc = await getDoc(slug)

    // If the document exists, redirect to the document's path
    if (doc?.slug?.current) {
      const path = getPathFromDocType(doc._type, doc.slug.current)
      res.setPreviewData({ token: readToken })
      res.setDraftMode({ enable: true })
      res.writeHead(307, { Location: path })
    }
    res.end('This page does not exist.')
    return
  }

  // If no slug is passed, return a 404 error
  res
    .status(404)
    .send(
      "This page that doesn't exist or has no slug. Please add a slug to the document.",
    )
  res.end()
}
