# Node 22 Upgrade & Compatibility Plan

**Goal:** Safely migrate this Next.js 14 + Sanity v3.92.0 + Vercel project from Node.js 18 to Node.js 22 (as required by Vercel), ensuring all dependencies and integrations remain compatible.

---

## Phase 1 — Dependency & Environment Audit

### Task 1: Audit Node.js 22 compatibility **and suggest upgrades**

**Goal:** Identify all dependencies that may break under Node 22 and recommend the latest safe upgrade target.

**Copilot prompt:**

> Write a Node.js script `scripts/audit-node-compat.js` that:
>
> 1. Reads all direct + transitive dependencies from `package-lock.json` or `yarn.lock`.
> 2. Checks their `engines.node` field (if present).
> 3. Flags packages that:
>    - Require `<22`
>    - Have known breaking changes for Node 22 (search npm registry & changelogs)
>    - Are native modules that may require rebuilds (`node-gyp`)
> 4. Fetches the latest stable version from npm registry.
> 5. Suggests an upgrade version that:
>    - Matches current major version if possible (non-breaking upgrade)
>    - Or proposes next major if current version is incompatible
> 6. Outputs a Markdown table of results to `node22-compat-report.md`.

**Example output table:**
| Package | Current Version | engines.node | Risk | Latest Compatible | Notes |
|---------|-----------------|--------------|------|-------------------|-------|
| sharp | 0.32.6 | >=14.15.0 | Low | 0.33.2 | Native module, rebuild needed |
| @sanity/cli | 3.92.0 | >=14 | Medium | 4.1.0 | Major upgrade required for Node 22 |

---

**Example implementation:**

```js
// scripts/audit-node-compat.js
#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const lockfile = fs.existsSync('package-lock.json')
  ? 'package-lock.json'
  : fs.existsSync('yarn.lock')
  ? 'yarn.lock'
  : null;

if (!lockfile) {
  console.error('No lockfile found. Please run npm install or yarn install first.');
  process.exit(1);
}

console.log(`Reading dependencies from ${lockfile}...`);

// Read package.json for top-level deps
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };

const results = [];

for (const [name, version] of Object.entries(deps)) {
  try {
    // npm view command returns JSON
    const info = JSON.parse(execSync(`npm view ${name} --json`, { encoding: 'utf-8' }));
    const enginesNode = info.engines?.node || 'Not specified';
    const latest = info['dist-tags']?.latest || 'Unknown';

    let risk = 'Low';
    let notes = '';

    if (typeof enginesNode === 'string' && /<\s*22/.test(enginesNode)) {
      risk = 'High';
      notes = 'Explicitly incompatible with Node 22';
    } else if (enginesNode !== 'Not specified' && !enginesNode.includes('22')) {
      risk = 'Medium';
      notes = 'Test required for Node 22';
    }

    // Check if native module
    if (info.gypfile) {
      notes += (notes ? ' | ' : '') + 'Native module, rebuild required';
    }

    results.push({
      name,
      current: version,
      enginesNode,
      risk,
      latest,
      notes
    });
  } catch (err) {
    results.push({
      name,
      current: version,
      enginesNode: 'Unknown',
      risk: 'Unknown',
      latest: 'Unknown',
      notes: `Error fetching info: ${err.message}`
    });
  }
}


// Output Markdown table
const md = [
'| Package | Current Version | engines.node | Risk | Latest Compatible | Notes |',
'|---------|-----------------|--------------|------|-------------------|-------|',
...results.map(r =>
`| ${r.name} | ${r.current} | ${r.enginesNode} | ${r.risk} | ${r.latest} | ${r.notes} |`
)
].join('\n');

fs.writeFileSync('node22-compat-report.md', md);
console.log('✅ Compatibility report written to node22-compat-report.md');
```

Usage: `chmod +x scripts/audit-node-compat.js`
`node scripts/audit-node-compat.js`

#### Acceptance Criteria

1. `node22-compat-report.md` exists and includes a Latest Compatible column.
2. Copilot can open upgrade PRs for any Medium or High risk packages.
3. Report is human-readable and actionable.

### Task 2: Audit external services & environment configs

**Goal:** Identify any runtime or environment settings that might break with Node 22.

**Copilot prompt:**

> Search the repo for `.nvmrc`, `.node-version`, Dockerfiles, and CI/CD configs specifying Node 18 and list them. For each occurrence:
>
> - Show the file path and line(s) containing the version.
> - Propose updated values for Node 22.
> - Flag any Vercel project settings that may override `package.json`'s `engines.node`.

**Acceptance criteria:**

- All references to Node 18 are found and documented with replacement suggestions.
- Vercel's current Node setting is known (CLI or dashboard check).

---

## Phase 2 — Local Environment Upgrade

### Task 3: Install Node 22 and update project settings

**Goal:** Move local & repo settings to Node 22 so we match Vercel's new runtime.

**Copilot prompt:**

> Provide exact terminal commands and a short explanation to:
>
> 1. Install Node 22 using `nvm` and switch to it.
> 2. Update `package.json` to set `"engines.node": "22.x"` (use a safe Node script so it works cross-platform).
> 3. Remove existing `node_modules` and lockfile(s) and reinstall dependencies cleanly.

**Commands:**

```bash
# install and use Node 22
nvm install 22
nvm use 22
node -v

# update package.json -> engines.node
node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json'));p.engines=p.engines||{};p.engines.node='22.x';fs.writeFileSync('package.json',JSON.stringify(p,null,2));console.log('package.json engines.node set to 22.x');"

# remove old installs and reinstall
rm -rf node_modules package-lock.json yarn.lock
npm ci
```

## Post-upgrade checks:

1. Start Studio locally with `npm run dev` and confirm authoring works. If so, stop the dev server.
2. Run the Next.js build with `npm run build` and fetch a sampling of pages that use Sanity data.
3. Restart the dev server and run automated tests and/or manual QA checklist created earlier.

### Task 4: Run local tests & smoke tests on Node 22

Goal: Verify dev server, build, and tests work under Node 22.

**Copilot prompt:**

> Create an executable shell script scripts/test-node22.sh that:
>
> 1. Prints the active Node version to a log.
> 2. Installs dependencies cleanly (if not already).
> 3. Starts npm run dev in the background, waits 30s, kills the dev server, then runs npm run build and npm run test.
> 4. Captures stdout/stderr to node22-test.log.
> 5. Exits non-zero on build/test failures.

**Example implementation:**

```js
#!/usr/bin/env bash
set -euo pipefail
LOG="node22-test.log"
echo "=== Node 22 local test run ===" > "$LOG"
echo "Node: $(node -v)" >> "$LOG"

# install
npm ci >> "$LOG" 2>&1

# start dev server in background, capture pid
npm run dev >> "$LOG" 2>&1 & DEV_PID=$!
sleep 30

# kill dev server if still running
if kill -0 "$DEV_PID" 2>/dev/null; then
  kill "$DEV_PID"
  sleep 2
fi

# build & test
npm run build >> "$LOG" 2>&1
npm run test >> "$LOG" 2>&1

echo "Completed Node 22 local test run. See $LOG" >> "$LOG"

```

#### Acceptance Criteria

1. `node22-test.log` exists and shows a successful build & tests.
2. Any failures are captured and can be fixed before proceeding.

## Phase 3 — Sanity.io Compatibility

### Task 5: Research Sanity v3 → v4 breaking changes & create migration checklist

**Goal:** Decide whether to upgrade Sanity before or after Node 22 migration.

**Copilot prompt:**

> Search Sanity release notes / migration docs since v3.92.0 up to v4 and produce:
>
> 1. A list of breaking changes that affect Next.js + Studio usage (client API, CLI, schema, plugins).
> 2. A migration checklist for upgrading v3.92.0 → v4.
> 3. A risk assessment (low/medium/high) for each change.

**Deliverable format:**

- Summary of v4 changes
- Checklist with:
  - Update Studio deps
  - Update client usage
  - Update/replace plugins
  - Run sanity upgrade
  - Verify dataset + queries
- Risk & mitigation per change.

### Task 6: Upgrade to Sanity v4 (optional / after approval)

**Goal:** Upgrade Studio + packages with minimal disruption.

**Copilot prompt:**

> Provide an executable upgrade plan with commands and safety checks:
>
> 1. Pin & upgrade sanity packages to v4.
> 2. Upgrade CLI & run Studio upgrade.
> 3. Update or replace incompatible plugins.
> 4. Validate Studio + client.

**Example commands:**

```bash
npm install sanity@latest
npx sanity upgrade # or `npx @sanity/cli upgrade`
npm outdated
npm install <plugin>@latest
```

**Post-upgrade checks:**

1. Studio works locally
2. Next.js build succeeds
3. Sanity data loads correctly

**Rollback plan:**

1. Keep branch/tag pre-upgrade
2. Revert & reinstall if needed

---

## Phase 4 — Vercel Upgrade

### Task 7: Update Vercel Node runtime settings

**Goal:** Ensure Vercel uses Node 22 for builds & serverless functions.

**Copilot prompt:**

> Provide step-by-step UI instructions for setting Node.js 22.x in Vercel Dashboard.
>
> Provide CLI commands to list & update projects.

**CLI example:**

```bash
npm i -g vercel@latest
vercel project ls --update-required --scope YOUR_TEAM
```

**Acceptance criteria:**

1. Vercel project no longer flagged for Node update.
2. Build image is latest.

---

## Phase 5 — Validation & Production Promotion

### Task 8: Validate preview deployment & promote

**Goal:** Automated & manual validation before production release.

**Copilot prompt:**

> Create scripts/validate-deploy.sh to:
>
> 1. Accept a preview URL.
> 2. Test important routes (home, SSR page, dynamic page, API route, static asset).
> 3. Check status codes + known strings.
> 4. Fail on any error.

**Example script:**

```bash
#!/usr/bin/env bash
set -euo pipefail
BASE_URL=${1:-"https://your-preview-url.vercel.app"}
LOG="validate-deploy.log"
echo "Validating $BASE_URL" > "$LOG"

routes=(
    "/"
    "/some-known-page"
    "/api/hello"
    "/_next/static/media/logo.svg"
)

fail=0
for r in "${routes[@]}"; do
    url="$BASE_URL$r"
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || true)
    if [ "$status" -ne 200 ]; then
        echo "ERROR: $url -> $status" | tee -a "$LOG"
        fail=1
    fi
done

if [ "$fail" -ne 0 ]; then
    echo "Validation failed. See $LOG"
    exit 1
else
    echo "Validation passed. See $LOG"
fi
```

**Manual checklist:**

1. Test pages with Sanity data
2. Test Studio authoring
3. Verify server actions & middleware
4. Monitor Sentry/logs post-promotion

**Acceptance criteria:**

1. Script passes for preview
2. No runtime errors after promotion
3. Sanity + public site both work as expected

```

```
