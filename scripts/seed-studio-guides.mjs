/**
 * Seeds the `studioGuide` help documents that appear under "📘 Help & Guides"
 * in the Studio (#278).
 *
 * These documents are published directly rather than left as drafts, because the
 * Studio strips the publish action from `studioGuide` — a draft seeded here would
 * have no way to be published from the UI.
 *
 * Idempotent: every guide has a fixed `_id` and is written with `createOrReplace`,
 * so re-running updates the guides in place rather than creating duplicates. That
 * makes this script the update mechanism too, not just a one-off.
 *
 * Dry run is the default. Nothing is written without `--execute`.
 *
 *   npx sanity exec scripts/seed-studio-guides.mjs --with-user-token
 *   npx sanity exec scripts/seed-studio-guides.mjs --with-user-token -- --execute
 *
 * Target a non-default dataset (do this before production):
 *
 *   npx sanity exec scripts/seed-studio-guides.mjs --with-user-token -- --dataset=dev --execute
 *
 * Delete guides that are no longer in the content module (studioGuide has no
 * delete action in the Studio, so this is the only way to remove one):
 *
 *   npx sanity exec scripts/seed-studio-guides.mjs --with-user-token -- --prune --execute
 */

import { createReadStream, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createClient } from '@sanity/client'

import { STUDIO_GUIDES, buildBody, screenshotFiles } from './studio-guides-content.mjs'

const ASSET_DIR = join(dirname(fileURLToPath(import.meta.url)), 'studio-guide-assets')

const EXECUTE = process.argv.includes('--execute')
const DRY_RUN = !EXECUTE

// Guides removed from the content module are reported but kept by default —
// deleting content is not something a seed should do on its own. `--prune` opts
// in. It matters because studioGuide has no delete action in the Studio, so an
// orphaned guide cannot be removed through the UI at all; this script is the
// only way to get rid of one.
const PRUNE = process.argv.includes('--prune')

// Reject a malformed --dataset rather than falling through to the env default,
// which is production. `--dataset dev` (space) and `--dataset=` (empty) would
// otherwise both silently target prod.
const datasetArgs = process.argv.filter(
  (arg) => arg === '--dataset' || arg.startsWith('--dataset='),
)
const malformed = datasetArgs.filter((arg) => !/^--dataset=.+$/.test(arg))
if (malformed.length > 0) {
  console.error(`Malformed dataset flag: ${malformed.join(' ')}`)
  console.error('Use --dataset=<name>, e.g. --dataset=dev. Refusing to fall back to the default.')
  process.exit(1)
}

const datasetOverride = datasetArgs[0]?.slice('--dataset='.length)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset =
  datasetOverride || process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET
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
  perspective: 'raw',
})

const buildDocuments = (assetIds) =>
  STUDIO_GUIDES.map(({ id, order, title, body }) => ({
    _id: id,
    _type: 'studioGuide',
    title,
    order,
    body: buildBody(body, assetIds),
  }))

const documents = buildDocuments({})

const duplicateIds = documents.map((doc) => doc._id).filter((id, i, all) => all.indexOf(id) !== i)
if (duplicateIds.length > 0) {
  console.error(`Duplicate guide ids, refusing to run: ${duplicateIds.join(', ')}`)
  process.exit(1)
}

const duplicateOrders = documents
  .map((doc) => doc.order)
  .filter((o, i, all) => all.indexOf(o) !== i)
if (duplicateOrders.length > 0) {
  console.error(
    `Duplicate order values, guides would sort unpredictably: ${duplicateOrders.join(', ')}`,
  )
  process.exit(1)
}

const screenshots = screenshotFiles(STUDIO_GUIDES)
const missingScreenshots = screenshots.filter((file) => !existsSync(join(ASSET_DIR, file)))
if (missingScreenshots.length > 0) {
  console.error(`Missing screenshot file(s) in ${ASSET_DIR}: ${missingScreenshots.join(', ')}`)
  process.exit(1)
}

console.log(`Project ${projectId} / dataset ${dataset}`)
console.log(
  `${DRY_RUN ? 'DRY RUN — nothing will be written' : 'EXECUTING — documents will be written'}\n`,
)

// perspective 'raw' returns drafts too, so exclude them: a drafts.<id> is a draft
// OF a guide being written here, not a separate document left behind.
const existing = await client.fetch(`*[_type == "studioGuide" && !(_id in path("drafts.**"))]{_id}`)
const existingIds = new Set(existing.map((doc) => doc._id))

for (const doc of documents) {
  const state = existingIds.has(doc._id) ? 'update' : 'create'
  const blocks = doc.body.length
  const checks = doc.body.filter(
    (block) => block.style === 'blockquote' && block.children?.[0]?.text?.startsWith('⟨CHECK'),
  ).length
  console.log(
    `  ${state.padEnd(6)} #${String(doc.order).padStart(3)}  ${doc.title}` +
      `  (${blocks} blocks${checks ? `, ${checks} CHECK marker${checks > 1 ? 's' : ''}` : ''})`,
  )
}

const orphans = [...existingIds].filter((id) => !documents.some((doc) => doc._id === id))
if (orphans.length > 0) {
  const fate = PRUNE ? 'will be DELETED (--prune)' : 'left untouched — pass --prune to delete'
  console.log(`\n  ${orphans.length} existing guide(s) not in this seed, ${fate}:`)
  orphans.forEach((id) => console.log(`    ${id}`))
}

if (screenshots.length > 0) {
  console.log(`\n  ${screenshots.length} screenshot(s) referenced: ${screenshots.join(', ')}`)
}

if (DRY_RUN) {
  console.log(`\nDry run complete — ${documents.length} guide(s) would be written.`)
  console.log('Re-run with -- --execute to write them.')
} else {
  // Assets live per dataset, so upload before writing: a guide seeded into a
  // dataset that never received the image would reference an asset that isn't
  // there. Sanity keys assets by content hash, so re-uploading the same file
  // resolves to the same asset rather than duplicating it.
  const assetIds = {}
  for (const file of screenshots) {
    try {
      const asset = await client.assets.upload('image', createReadStream(join(ASSET_DIR, file)), {
        filename: file,
      })
      assetIds[file] = asset._id
      console.log(`  uploaded ${file} -> ${asset._id}`)
    } catch (error) {
      console.error(`\nFailed to upload ${file}: ${error.message}`)
      console.error('No guides were written.')
      process.exit(1)
    }
  }

  const transaction = client.transaction()
  buildDocuments(assetIds).forEach((doc) => transaction.createOrReplace(doc))
  if (PRUNE) {
    // Same transaction as the writes, so a failure leaves the dataset untouched
    // rather than deleting guides and then failing to write the rest.
    orphans.forEach((id) => transaction.delete(id))
  }

  try {
    // One transaction, so this is all-or-nothing — a failure leaves the dataset
    // exactly as it was rather than half-seeded.
    await transaction.commit()
  } catch (error) {
    console.error(`\nFailed to write to ${dataset}: ${error.message}`)
    console.error('No guides were written.')
    process.exit(1)
  }

  const pruned = PRUNE && orphans.length > 0 ? `, deleted ${orphans.length}` : ''
  console.log(`\nWrote ${documents.length} guide(s)${pruned} to ${dataset}.`)
}
