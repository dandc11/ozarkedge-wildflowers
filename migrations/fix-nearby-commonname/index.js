/**
 * Migration: fix growingNearbyPlantList[].commonName corrupted with plantBotanicalName
 *
 * Background: the Dec-2025 `convert-nearby-plants` migration set each nearby item's
 * `commonName` to `item.caption`, which in the legacy `figure` data held the BOTANICAL
 * name. Result: commonName == plantBotanicalName on 511 items / 43 published docs.
 * (Full root-cause: memory `project_nearby_commonname_incident`.)
 *
 * There is no original common name to "restore" — one never existed. This forward-
 * corrects each corrupted item by:
 *   1. Looking up the REAL common name from the linked nativePlant document
 *      (plantName.commonName[0] where a botanicalName alias matches plantBotanicalName).
 *   2. If a distinct real common name is found -> set commonName to it.
 *   3. Otherwise -> unset commonName (clear the bogus value; the field is optional /
 *      editor-reference-only and not rendered on the site).
 *
 * Only items where `commonName == plantBotanicalName` are touched, so the script is
 * idempotent and safe to re-run.
 *
 * Uses @sanity/client directly (like copy-title-to-alttext) because it needs a
 * cross-document lookup, which sanity/migrate's per-document model can't do cleanly.
 *
 * Usage (ALWAYS dry-run first, and take a fresh dataset export before executing):
 *   npx sanity exec migrations/fix-nearby-commonname/index.js --with-user-token            # dry-run (default)
 *   npx sanity exec migrations/fix-nearby-commonname/index.js --with-user-token -- --execute
 */

import { createClient } from '@sanity/client'

const EXECUTE = process.argv.includes('--execute')
const DRY_RUN = !EXECUTE
const BATCH_SIZE = 50

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET
const token = process.env.SANITY_AUTH_TOKEN

if (!projectId || !dataset) {
  console.error('Missing project ID or dataset. Check your environment.')
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
  perspective: 'raw', // include drafts as their own documents
})

const norm = (s) => (typeof s === 'string' ? s.trim().toLowerCase() : '')

/** Build a map: lower(botanical alias) -> primary real common name. */
async function buildCommonNameMap() {
  const plants = await client.fetch(
    `*[_type == "nativePlant" && defined(plantName.botanicalName)]{
      "botanical": plantName.botanicalName,
      "common": plantName.commonName
    }`,
  )
  const map = new Map()
  for (const p of plants) {
    const botanicals = Array.isArray(p.botanical) ? p.botanical : [p.botanical]
    const common = Array.isArray(p.common) ? p.common[0] : p.common
    if (!common) continue
    for (const b of botanicals) {
      const key = norm(b)
      if (key && !map.has(key)) map.set(key, common)
    }
  }
  return map
}

async function run() {
  console.log('\nMigration: fix-nearby-commonname')
  console.log(`Project:   ${projectId}`)
  console.log(`Dataset:   ${dataset}`)
  console.log(`Mode:      ${DRY_RUN ? 'DRY RUN — no changes will be made' : 'LIVE — writing changes'}`)
  console.log()

  const nameMap = await buildCommonNameMap()
  console.log(`Loaded ${nameMap.size} botanical→common name mappings.\n`)

  const docs = await client.fetch(
    `*[_type == "nativePlant" && count(growingNearbyPlantList[defined(commonName) && defined(plantBotanicalName) && commonName == plantBotanicalName]) > 0]{
      _id,
      "items": growingNearbyPlantList[]{ _key, plantBotanicalName, commonName }
    } | order(_id asc)`,
  )

  if (docs.length === 0) {
    console.log('No documents with corrupted nearby-plant common names. Nothing to do.')
    return
  }

  let totalSet = 0
  let totalUnset = 0
  const patches = [] // { id, set: {...}, unset: [...] }

  for (const doc of docs) {
    const setOps = {}
    const unsetOps = []
    for (const item of doc.items || []) {
      const bn = item.plantBotanicalName
      const cn = item.commonName
      if (!bn || !cn || norm(bn) !== norm(cn) || !item._key) continue // only corrupted items

      const real = nameMap.get(norm(bn))
      const path = `growingNearbyPlantList[_key=="${item._key}"].commonName`
      if (real && norm(real) !== norm(bn)) {
        setOps[path] = real
        totalSet++
        console.log(`  ${doc._id}  "${bn}" -> commonName="${real}"`)
      } else {
        unsetOps.push(path)
        totalUnset++
        console.log(`  ${doc._id}  "${bn}" -> commonName UNSET (no distinct common name)`)
      }
    }
    if (Object.keys(setOps).length || unsetOps.length) {
      patches.push({ id: doc._id, set: setOps, unset: unsetOps })
    }
  }

  console.log(
    `\nPlanned: ${totalSet} items set from linked plant, ${totalUnset} items cleared, across ${patches.length} documents.`,
  )

  if (DRY_RUN) {
    console.log('\nDry run complete — no changes written. Re-run with `-- --execute` to apply.')
    return
  }

  let done = 0
  for (let i = 0; i < patches.length; i += BATCH_SIZE) {
    const batch = patches.slice(i, i + BATCH_SIZE)
    const tx = client.transaction()
    for (const p of batch) {
      let patch = client.patch(p.id)
      if (Object.keys(p.set).length) patch = patch.set(p.set)
      if (p.unset.length) patch = patch.unset(p.unset)
      tx.patch(patch)
    }
    await tx.commit()
    done += batch.length
    console.log(`Committed ${done} / ${patches.length} documents`)
  }
  console.log('\nDone.')
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
