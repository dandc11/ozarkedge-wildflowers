// pages/api/menu.js
import { readToken } from '../../lib/sanity.api'
import { getClient } from '../../lib/sanity.client'
import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
  origin: ['https:localhost', 'https://ozarkedge-wildflowers-staging.vercel.app/', 'https://ozarkedgewildflowers.com'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

const client = getClient(
{ token: readToken }
)

export default async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  const menu = await client.fetch('*[_type == "menu" && !(_id in path("drafts.**"))]{menuBackgroundImage, mobileMenuBackgroundImage, menuItems[]{title,"menuItemLink": {"docType": link.internalLink->_type, "slug": link.internalLink->slug.current}}}')
  res.status(200).json(menu)
}