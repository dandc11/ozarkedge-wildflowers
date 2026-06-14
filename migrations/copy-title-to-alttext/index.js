/**
 * Migration: Copy title → altText for image assets missing alt text
 *
 * sanity.imageAsset is a system type outside the schema, so the sanity/migrate
 * framework can't iterate over it. This script uses the Sanity client directly.
 *
 * Usage (always dry-run first):
 *   npx sanity exec migrations/copy-title-to-alttext/index.js --with-user-token -- --dry-run
 *   npx sanity exec migrations/copy-title-to-alttext/index.js --with-user-token
 */

import { createClient } from '@sanity/client'

const DRY_RUN = process.argv.includes('--dry-run')
const BATCH_SIZE = 100

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET
const token = process.env.SANITY_AUTH_TOKEN

if (!projectId || !dataset) {
  console.error('Missing project ID or dataset. Check your .env.local.')
  process.exit(1)
}

if (!token) {
  console.error('No auth token found. Run with --with-user-token.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-10-28',
  useCdn: false,
})

const QUERY = `*[_type == "sanity.imageAsset"
  && defined(title) && string::length(title) > 0
  && (!defined(altText) || altText == "")
]{ _id, title, altText } | order(_id asc)`

async function run() {
  console.log('\nMigration: copy-title-to-alttext')
  console.log(`Project:   ${projectId}`)
  console.log(`Dataset:   ${dataset}`)
  console.log(`Mode:      ${DRY_RUN ? 'DRY RUN — no changes will be made' : 'LIVE'}`)
  console.log()

  const assets = await client.fetch(QUERY)

  if (assets.length === 0) {
    console.log('No image assets found with a title but no altText. Nothing to do.')
    return
  }

  console.log(`Found ${assets.length} asset(s) to update:\n`)
  for (const asset of assets) {
    console.log(`  "${asset.title}"`)
    console.log(`   ${asset._id}`)
  }

  if (DRY_RUN) {
    console.log(`\nDry run complete — ${assets.length} asset(s) would be updated.`)
    console.log('Run without --dry-run to apply changes.')
    return
  }

  console.log()
  let updated = 0
  for (let i = 0; i < assets.length; i += BATCH_SIZE) {
    const batch = assets.slice(i, i + BATCH_SIZE)
    const transaction = client.transaction()
    for (const asset of batch) {
      transaction.patch(asset._id, { set: { altText: asset.title.trim() } })
    }
    await transaction.commit()
    updated += batch.length
    console.log(`Updated ${updated} / ${assets.length}`)
  }

  console.log(`\nDone. ${updated} asset(s) updated.`)
}

run().catch((err) => {
  console.error('\nMigration failed:', err.message)
  process.exit(1)
})
