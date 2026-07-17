/**
 * READ-ONLY investigation: pull the Sanity History (transactions) API for a few
 * nativePlant docs to see WHEN each doc was mutated and WHO authored each transaction.
 * (On Free plan, mutation bodies are gated via `excludeContent=true`, so this prints metadata only.)
 * Run: npx sanity exec scripts/investigate-history.mjs --with-user-token
 * (--with-user-token populates SANITY_AUTH_TOKEN; token is never printed.)
 */

const projectId = 'zljsx9u1'
const dataset = 'prod'
const token = process.env.SANITY_AUTH_TOKEN
if (!token) {
  console.error('No SANITY_AUTH_TOKEN. Run with --with-user-token.')
  process.exit(1)
}

// Doc IDs from CLI (`… exec <script> --with-user-token -- <id> <id>`), else examples.
const cliIds = process.argv.filter((a) => /^(drafts\.|versions\.)?[0-9a-f]{8}-/.test(a))
const docIds = cliIds.length
  ? cliIds
  : [
      '8792d931-910c-4424-b1f5-9bc65c30b048', // rose-verbena
      'ac72aeae-24e1-4cef-98fb-686eb0ace32e', // rosinweed
      '570d0dd4-89c7-4bc1-b0e9-64701199968a', // wild-bergamot
    ]

/** Detect commonName==plantBotanicalName writes inside a mutation set. */
function scanMutations(mutations) {
  const notes = []
  for (const m of mutations || []) {
    const op = Object.keys(m)[0]
    const body = m[op]
    const str = JSON.stringify(body)
    if (/growingNearbyPlantList|plantBotanicalName|commonName/.test(str)) {
      // Count set-pairs where commonName equals plantBotanicalName in this payload
      let matchPairs = 0
      const items = str.match(/"plantBotanicalName":"[^"]*"/g) || []
      for (const bn of items) {
        const val = bn.split(':')[1]
        if (str.includes(`"commonName":${val}`)) matchPairs++
      }
      notes.push(`${op}${m[op]?.id ? '(' + m[op].id + ')' : ''} touches nearby list; commonName==botanical pairs≈${matchPairs}`)
    }
  }
  return notes
}

async function history(docId) {
  const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/history/${dataset}/transactions/${docId}?excludeContent=true&limit=2000`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    console.error(`  HTTP ${res.status} for ${docId}: ${await res.text()}`)
    return
  }
  const text = await res.text()
  const lines = text.trim().split('\n').filter(Boolean)
  console.log(`\n===== ${docId} — ${lines.length} transactions =====`)
  for (const line of lines) {
    let tx
    try { tx = JSON.parse(line) } catch { continue }
    const nDocs = (tx.documentIDs || []).length
    console.log(`${tx.timestamp}  tx=${tx.id}  author=${tx.author}  docsInTx=${nDocs}`)
  }
}

for (const id of docIds) {
  await history(id)
}
