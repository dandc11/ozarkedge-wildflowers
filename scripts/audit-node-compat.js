#!/usr/bin/env node

import fs from 'fs'
import { execSync } from 'child_process'
import path from 'path'

const lockfile = fs.existsSync('package-lock.json')
  ? 'package-lock.json'
  : fs.existsSync('yarn.lock')
    ? 'yarn.lock'
    : null

if (!lockfile) {
  console.error('No lockfile found. Please run npm install or yarn install first.')
  process.exit(1)
}

console.log(`Reading dependencies from ${lockfile}...`)

// Read package.json for top-level deps
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
const deps = { ...pkg.dependencies, ...pkg.devDependencies }

const results = []
let processed = 0
const total = Object.keys(deps).length

for (const [name, version] of Object.entries(deps)) {
  processed++
  console.log(`Processing ${processed}/${total}: ${name}`)

  try {
    // npm view command returns JSON
    const info = JSON.parse(execSync(`npm view ${name} --json`, { encoding: 'utf-8' }))
    const enginesNode = info.engines?.node || 'Not specified'
    const latest = info['dist-tags']?.latest || 'Unknown'

    let risk = 'Low'
    let notes = ''

    // Check for explicit Node 22 incompatibility
    if (typeof enginesNode === 'string' && /<\s*22/.test(enginesNode)) {
      risk = 'High'
      notes = 'Explicitly incompatible with Node 22'
    } else if (enginesNode !== 'Not specified' && !enginesNode.includes('22')) {
      // Check if engines.node exists but doesn't mention 22
      if (typeof enginesNode === 'string') {
        const hasMaxVersion = /[<<=]\s*\d+/.test(enginesNode)
        if (hasMaxVersion) {
          risk = 'Medium'
          notes = 'Test required for Node 22'
        }
      }
    }

    // Check if native module (requires rebuild)
    if (info.gypfile || (info.scripts && info.scripts.install)) {
      notes += (notes ? ' | ' : '') + 'Native module, rebuild required'
    }

    // Check for common packages known to have Node 22 issues
    const knownIssues = {
      sharp: 'Native module with Node version dependencies',
      'node-sass': 'Deprecated, use sass instead',
      fsevents: 'macOS native module',
      canvas: 'Native module with Cairo dependencies',
    }

    if (knownIssues[name]) {
      notes += (notes ? ' | ' : '') + knownIssues[name]
      if (risk === 'Low') risk = 'Medium'
    }

    // Determine upgrade recommendation
    let latestCompatible = latest
    const currentMajor = version.replace(/[^0-9].*/, '')
    const latestMajor = latest.replace(/[^0-9].*/, '')

    if (currentMajor !== latestMajor) {
      notes +=
        (notes ? ' | ' : '') + `Major upgrade available (${currentMajor}.x → ${latestMajor}.x)`
    }

    results.push({
      name,
      current: version,
      enginesNode,
      risk,
      latest: latestCompatible,
      notes: notes || 'No known issues',
    })
  } catch (err) {
    console.warn(`Warning: Could not fetch info for ${name}: ${err.message}`)
    results.push({
      name,
      current: version,
      enginesNode: 'Unknown',
      risk: 'Unknown',
      latest: 'Unknown',
      notes: `Error fetching info: ${err.message}`,
    })
  }
}

// Sort results by risk level (High > Medium > Low > Unknown)
const riskOrder = { High: 4, Medium: 3, Low: 2, Unknown: 1 }
results.sort((a, b) => riskOrder[b.risk] - riskOrder[a.risk])

// Output Markdown table
const md = [
  '# Node.js 22 Compatibility Report',
  '',
  `Generated on: ${new Date().toISOString()}`,
  `Total packages analyzed: ${results.length}`,
  '',
  '## Summary',
  '',
  `- **High Risk**: ${results.filter((r) => r.risk === 'High').length} packages`,
  `- **Medium Risk**: ${results.filter((r) => r.risk === 'Medium').length} packages`,
  `- **Low Risk**: ${results.filter((r) => r.risk === 'Low').length} packages`,
  `- **Unknown**: ${results.filter((r) => r.risk === 'Unknown').length} packages`,
  '',
  '## Detailed Results',
  '',
  '| Package | Current Version | engines.node | Risk | Latest Compatible | Notes |',
  '|---------|-----------------|--------------|------|-------------------|-------|',
  ...results.map(
    (r) => `| ${r.name} | ${r.current} | ${r.enginesNode} | ${r.risk} | ${r.latest} | ${r.notes} |`,
  ),
].join('\n')

fs.writeFileSync('node22-compat-report.md', md)
console.log('✅ Compatibility report written to node22-compat-report.md')

// Print summary to console
console.log('\n📊 Summary:')
console.log(`   High Risk: ${results.filter((r) => r.risk === 'High').length}`)
console.log(`   Medium Risk: ${results.filter((r) => r.risk === 'Medium').length}`)
console.log(`   Low Risk: ${results.filter((r) => r.risk === 'Low').length}`)
console.log(`   Unknown: ${results.filter((r) => r.risk === 'Unknown').length}`)

if (results.filter((r) => r.risk === 'High').length > 0) {
  console.log('\n⚠️  High risk packages found! Review node22-compat-report.md before proceeding.')
  process.exit(1)
}
