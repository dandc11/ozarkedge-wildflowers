/** READ-ONLY: identify transaction author ppMH48DLM (human vs robot vs agent). */
const projectId = 'zljsx9u1'
const token = process.env.SANITY_AUTH_TOKEN
// Pass `-- --author=<id>` to resolve a different identity; defaults to the incident author.
const TARGET = (process.argv.find((a) => a.startsWith('--author=')) || '--author=ppMH48DLM').split('=')[1]
const h = { Authorization: `Bearer ${token}` }

async function j(url) {
  const r = await fetch(url, { headers: h })
  return { ok: r.ok, status: r.status, body: r.ok ? await r.json() : await r.text() }
}

// 1) Project detail: members (humans) + robots
const proj = await j(`https://api.sanity.io/v2021-06-07/projects/${projectId}`)
if (proj.ok) {
  const members = proj.body.members || []
  console.log(`\nMembers (${members.length}):`)
  for (const m of members) {
    console.log(`  id=${m.id} robot=${!!m.isRobot} roles=${(m.roles||[]).map(r=>r.name).join(',')}${m.id===TARGET?'   <== TARGET':''}`)
  }
}

// 2) Robots/tokens on the project
const robots = await j(`https://api.sanity.io/v2021-06-07/projects/${projectId}/tokens`)
console.log(`\nTokens/robots endpoint status=${robots.status}`)
if (robots.ok) {
  for (const t of robots.body) {
    console.log(`  robotId=${t.id || t.projectUserId} label=${JSON.stringify(t.label)}${(t.id===TARGET||t.projectUserId===TARGET)?'   <== TARGET':''}`)
  }
}

// 3) Resolve the target as a user profile
const user = await j(`https://api.sanity.io/v2021-06-07/users/${TARGET}`)
console.log(`\nUser profile ${TARGET} status=${user.status}:`)
console.log(typeof user.body === 'string' ? user.body : JSON.stringify(user.body))
