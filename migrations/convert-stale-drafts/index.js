/**
 * Migration: bring stale nativePlant DRAFTS up to the current schema shape
 *
 * Background: `convert-plant-names-to-arrays` filters drafts out
 * (`!(_id in path("drafts.**"))`), and the Dec-2025 `convert-nearby-plants` run never
 * processed these drafts either. Their published counterparts were converted, so three
 * drafts have sat in the pre-migration shape and now fail Studio validation:
 *
 *   - `plantName.commonName` / `plantName.botanicalName` are strings, not arrays.
 *   - `growingNearbyPlantList` still holds legacy `figure` items, which the current
 *     schema no longer declares ("Item of type figure not valid for this list").
 *
 * All published documents are already clean — this is drafts-only. The risk it closes:
 * publishing a stale draft would overwrite a clean published document with the
 * pre-migration shape, undoing the earlier conversion.
 *
 * This migration mirrors, exactly, what the Dec-2025 conversion produced in published
 * data (verified field-by-field against `2ad8b68d-…`):
 *
 *   figure                          ->  nearbyPlantFigure
 *   ------------------------------      ------------------------------------------
 *   _key: "<k>"                     ->  _key: "converted-<k>"
 *   asset / alt / caption /         ->  image: { _type: 'image', asset, alt, caption,
 *     showCaption / crop / hotspot            showCaption, crop, hotspot }
 *   caption (held the botanical     ->  plantBotanicalName
 *     name in legacy data)
 *   link.internalLink               ->  DROPPED — `nearbyPlantFigure` has no link field;
 *                                       auto-linking now derives from plantBotanicalName.
 *   captionPosition                 ->  DROPPED — not a field on the image.
 *
 * `commonName` is resolved from the linked nativePlant document rather than copied from
 * the caption, so this does not reintroduce the commonName==botanicalName corruption that
 * #304 / `fix-nearby-commonname` just cleaned up. If no distinct real common name exists,
 * the field is omitted (it is optional and editor-reference-only).
 *
 * Idempotent: only string-shaped names and `figure` items are touched, so a second run
 * reports nothing to do.
 *
 * SAFETY: every patch target is asserted to be a `drafts.` ID before anything is written.
 *
 * Usage (ALWAYS dry-run first, and take a fresh dataset export before executing):
 *   npx sanity exec migrations/convert-stale-drafts/index.js --with-user-token             # dry-run (default)
 *   npx sanity exec migrations/convert-stale-drafts/index.js --with-user-token -- --execute
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
  perspective: 'raw', // drafts are their own documents
})

/**
 * Common names that a plain comma-split cannot resolve correctly, because the source
 * string packs two names into one phrase with no delimiter. Keyed by the exact stored
 * string so the override is auditable and cannot fire on anything else.
 */
const COMMON_NAME_OVERRIDES = {
  'Plains or Prairie prickly pear': ['Plains prickly pear', 'Prairie prickly pear'],
}

const norm = (s) => (typeof s === 'string' ? s.trim().toLowerCase() : '')

/**
 * Converts a stored name string to an array, preserving order.
 * @param {string} nameString - The stored name value
 * @returns {string[]} Array of trimmed names
 */
function toNameArray(nameString) {
  if (typeof nameString !== 'string') return []
  const override = COMMON_NAME_OVERRIDES[nameString.trim()]
  if (override) return [...override]
  return nameString
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean)
}

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

/**
 * Converts a legacy `figure` item into a `nearbyPlantFigure` item.
 * @param {object} item - The legacy figure item
 * @param {Map<string, string>} nameMap - botanical -> common name lookup
 * @returns {{converted: object, notes: string[]}}
 */
function convertFigureItem(item, nameMap) {
  const notes = []
  // Legacy data stored the botanical name in `caption`; `alt` carried the same value.
  const botanical = (item.caption || item.alt || '').trim()

  const image = { _type: 'image', asset: item.asset }
  if (item.alt) image.alt = item.alt
  if (item.caption) image.caption = item.caption
  if (typeof item.showCaption === 'boolean') image.showCaption = item.showCaption
  if (item.crop) image.crop = item.crop
  if (item.hotspot) image.hotspot = item.hotspot

  const converted = {
    _key: `converted-${item._key}`,
    _type: 'nearbyPlantFigure',
    image,
    plantBotanicalName: botanical,
  }

  const real = nameMap.get(norm(botanical))
  if (real && norm(real) !== norm(botanical)) {
    converted.commonName = real
  }

  if (item.link)
    notes.push(`dropped legacy link on ${item._key} (auto-linking now uses botanical name)`)
  if (item.captionPosition) notes.push(`dropped captionPosition on ${item._key}`)
  if (!botanical)
    notes.push(`WARNING: ${item._key} has no caption/alt — plantBotanicalName will be empty`)

  return { converted, notes }
}

async function run() {
  console.log('\nMigration: convert-stale-drafts')
  console.log(`Project:   ${projectId}`)
  console.log(`Dataset:   ${dataset}`)
  console.log(
    `Mode:      ${DRY_RUN ? 'DRY RUN — no changes will be made' : 'LIVE — writing changes'}`,
  )
  console.log()

  const nameMap = await buildCommonNameMap()
  console.log(`Loaded ${nameMap.size} botanical→common name mappings.\n`)

  // Drafts only, and only those actually needing work.
  const docs = await client.fetch(
    `*[_type == "nativePlant"
       && _id in path("drafts.**")
       && (
            (defined(plantName.commonName) && !defined(plantName.commonName[0]))
         || (defined(plantName.botanicalName) && !defined(plantName.botanicalName[0]))
         || count(growingNearbyPlantList[_type == "figure"]) > 0
       )
     ]{ _id, plantName, growingNearbyPlantList } | order(_id asc)`,
  )

  if (docs.length === 0) {
    console.log('No stale drafts found. Nothing to do.')
    return
  }

  const patches = []

  for (const doc of docs) {
    // Hard safety gate: never touch a published document.
    if (!doc._id.startsWith('drafts.')) {
      throw new Error(`Refusing to patch non-draft document ${doc._id}`)
    }

    const setOps = {}
    console.log(`\n${doc._id}`)

    for (const field of ['commonName', 'botanicalName']) {
      const value = doc.plantName?.[field]
      if (typeof value === 'string') {
        const arr = toNameArray(value)
        if (arr.length === 0) {
          console.log(`  WARNING: ${field} "${value}" produced an empty array — skipping`)
          continue
        }
        setOps[`plantName.${field}`] = arr
        const flag = COMMON_NAME_OVERRIDES[value.trim()] ? '  [override]' : ''
        console.log(`  ${field}: "${value}" -> [${arr.map((n) => `"${n}"`).join(', ')}]${flag}`)
      }
    }

    const list = doc.growingNearbyPlantList
    const legacyCount = (list || []).filter((i) => i?._type === 'figure').length
    if (legacyCount > 0) {
      const newList = list.map((item) => {
        if (item?._type !== 'figure') return item
        const { converted, notes } = convertFigureItem(item, nameMap)
        const cn = converted.commonName ? ` commonName="${converted.commonName}"` : ''
        console.log(`  figure -> nearbyPlantFigure: "${converted.plantBotanicalName}"${cn}`)
        for (const n of notes) console.log(`    - ${n}`)
        return converted
      })
      setOps.growingNearbyPlantList = newList
      console.log(`  converted ${legacyCount} legacy figure item(s)`)
    }

    if (Object.keys(setOps).length) patches.push({ id: doc._id, set: setOps })
  }

  console.log(`\nPlanned: ${patches.length} draft document(s) to patch.`)
  console.log(`Published documents affected: 0 (drafts-only by query + assertion).`)

  if (DRY_RUN) {
    console.log('\nDry run complete — no changes written. Re-run with `-- --execute` to apply.')
    return
  }

  let done = 0
  for (let i = 0; i < patches.length; i += BATCH_SIZE) {
    const batch = patches.slice(i, i + BATCH_SIZE)
    const tx = client.transaction()
    for (const p of batch) {
      if (!p.id.startsWith('drafts.'))
        throw new Error(`Refusing to patch non-draft document ${p.id}`)
      tx.patch(client.patch(p.id).set(p.set))
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
