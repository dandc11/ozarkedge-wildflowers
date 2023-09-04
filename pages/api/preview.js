import { getClient } from '../../lib/sanity.client'
import { getPathFromDocType } from '../../utilities/helperUtil'
import { apiVersion, previewSecretId, readToken } from '../../lib/sanity.api'
import { getPreviewSecret } from '../../utilities/previewSecret'
import groq from 'groq'

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

  const client = getClient({ token: readToken }).withConfig({
    useCdn: false,
    token: readToken,
  })

  // Check the slug against existing documents 
  if (slug) {
    const getDoc = async function (slug) {
      return await client.fetch(docQuery, {
        slug,
      })
    }

    const doc = await getDoc(slug)

    //  
    if (doc?.slug?.current) {
      const path = getPathFromDocType(doc._type, doc.slug.current)
      res.setPreviewData({ token: readToken })
      res.setDraftMode({ enable: true })
      res.writeHead(307, { Location: path })
    }
    res.end('This page does not exist.');
    return
  }

  res
    .status(404)
    .send(
      "This page that doesn't exist or has no slug. Please add a slug to the document."
    )
  res.end()
}
