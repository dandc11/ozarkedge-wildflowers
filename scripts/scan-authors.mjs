/**
 * READ-ONLY: characterize WHO is mutating the dataset, to surface Content Agent /
 * robot / automation activity vs human editors.
 *
 * Run: npx sanity exec scripts/scan-authors.mjs --with-user-token
 */
const projectId = 'zljsx9u1'
const dataset = 'prod'
const token = process.env.SANITY_AUTH_TOKEN
if (!token) {
  console.error('No SANITY_AUTH_TOKEN. Run with --with-user-token.')
  process.exit(1)
}
const h = { Authorization: `Bearer ${token}` }

// Known identities on this project (from /projects/<id> members + tokens)
const KNOWN = {
  ppMH48DLM: 'project owner (human, admin)',
  pdGwIDhXG: 'human editor',
  pfnsYOxNw: 'human editor',
  pE5kZs9om: 'ROBOT (editor)',
  pSSeAMfEd: 'ROBOT (viewer)',
}

async function txt(url) {
  const r = await fetch(url, { headers: h })
  return { ok: r.ok, status: r.status, body: await r.text() }
}

// 1) Dataset-wide recent transactions, tally by author
console.log('=== Dataset-wide transaction authors (most recent window) ===')
const dw = await txt(`https://${projectId}.api.sanity.io/v2021-06-07/data/history/${dataset}/transactions?excludeContent=true&limit=100000`)
if (!dw.ok) {
  console.log(`  dataset-wide history not available: HTTP ${dw.status} ${dw.body.slice(0,200)}`)
} else {
  const lines = dw.body.trim().split('\n').filter(Boolean)
  const byAuthor = {}
  let min = null, max = null
  for (const l of lines) {
    let tx; try { tx = JSON.parse(l) } catch { continue }
    byAuthor[tx.author] = (byAuthor[tx.author] || 0) + 1
    if (!min || tx.timestamp < min) min = tx.timestamp
    if (!max || tx.timestamp > max) max = tx.timestamp
  }
  console.log(`  transactions=${lines.length}  window=${min} .. ${max}`)
  for (const [a, n] of Object.entries(byAuthor).sort((x, y) => y[1] - x[1])) {
    console.log(`  ${String(n).padStart(5)}  ${a}  ${KNOWN[a] ? '<- ' + KNOWN[a] : (a.startsWith('s') ? '<- token/robot?' : '')}`)
  }
}

// 2) History of the agent-created version documents (who authored them)
console.log('\n=== Agent version-document histories ===')
const agentDocs = [
  'versions.agent-slYg28.895c4c4c-4932-48d5-ad6f-544f99e09982',
]
for (const id of agentDocs) {
  const r = await txt(`https://${projectId}.api.sanity.io/v2021-06-07/data/history/${dataset}/transactions/${encodeURIComponent(id)}?excludeContent=true&limit=100`)
  console.log(`  ${id}  status=${r.status}`)
  if (r.ok) for (const l of r.body.trim().split('\n').filter(Boolean)) {
    let tx; try { tx = JSON.parse(l) } catch { continue }
    console.log(`     ${tx.timestamp}  author=${tx.author} ${KNOWN[tx.author] || ''}  tx=${tx.id}`)
  }
}
