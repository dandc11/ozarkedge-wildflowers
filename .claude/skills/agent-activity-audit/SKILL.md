---
name: agent-activity-audit
description: Audit who and what mutated the Sanity dataset — human editors, robot tokens, and AI (Content Agent / AI Assist / Agent Actions) — using the transaction history API, the versions.agent-* namespace, member/token lookups, and dataset-export diffs. Use when investigating a suspicious or unexplained content change, attributing a mutation to an actor and time, checking for AI/agent-authored edits, or reviewing how to roll back and set guardrails.
---

# Agent & Automation Activity Audit (Sanity)

How to attribute a Sanity content mutation to an actor + time, specifically surface AI/agent activity, and know the limits of what is observable. Project: `zljsx9u1` / dataset `prod`.

## What is (and isn't) observable — read first

Sanity's AI tools leave **partial** traces. Do not assume "no agent identity in history" means "no agent involvement."

- **Confirmed agent edits are authored by the human who confirmed them.** The Content Agent and AI Assist "work within your permissions" — the resulting transaction's `author` is the *triggering user*, not a distinct agent identity. So author alone cannot prove/disprove AI involvement for Studio-triggered edits.
- **Content Agent changes are "shy."** Per Sanity docs, proposed/pending agent changes "won't appear in document history, content releases, or search results" until accepted; they're accessible via the Content Agent API but not the normal history.
- **The durable fingerprints of agent work are:**
  1. `versions.agent-<id>.<docId>` documents — created when agent changes are routed to a **Content Release** (release id prefixed `agent-`).
  2. **Robot-token authorship** — when changes come through the **Agent Actions API** (server automation) using a project token, the transaction `author` is that robot/token identity.
- **Migrations / scripts run with `--with-user-token`** are authored as the CLI user (a human admin), and appear as a single transaction touching many docs at one instant — the signature of automation, even though the author is human.

## Known identities on this project

Resolve any `author` id against the project members + tokens (Management API):

```bash
# members (humans + robots) and their roles
curl -s -H "Authorization: Bearer $TOKEN" \
  https://api.sanity.io/v2021-06-07/projects/zljsx9u1 | jq '.members[] | {id, isRobot, roles: [.roles[].name]}'
# project tokens (robots)
curl -s -H "Authorization: Bearer $TOKEN" \
  https://api.sanity.io/v2021-06-07/projects/zljsx9u1/tokens
# resolve a single user id to a name
curl -s -H "Authorization: Bearer $TOKEN" \
  https://api.sanity.io/v2021-06-07/users/<authorId> | jq '{id, displayName, email}'
```

As of 2026-07-16 — **re-resolve live, membership changes:**

| Identity | Who / what |
| --- | --- |
| `ppMH48DLM` | project owner — human, administrator |
| `pdGwIDhXG` | content editor — human, **GitHub login**, ~2591 edits |
| `pfnsYOxNw` | content editor (same person as `pdGwIDhXG`) — **REMOVED 2026-07-17**. Original **Sanity login**, ~147 edits; still the author of those edits. See below. |
| `pOKfiOCoE` | robot (viewer) — the `OE_BACKUP_READ` token used by the nightly backup. Read-only, so it should **never** author a transaction. |
| `pE5kZs9om`, `pSSeAMfEd` | robots (editor / viewer) — **zero** transactions to date |
| `OE_BACKUP_READ`, `SANITY_OE_APP_WRITE`, `SANITY_OE_APP_READ` | project API tokens |
| `god` | Sanity system / internal |

> ⚠️ **`pdGwIDhXG` and `pfnsYOxNw` are the same human — and `pfnsYOxNw` is now an orphan id.** The content editor held two identities because they signed in with two providers: GitHub created the second in 2025-07, and that's the one they actually work in (~2591 of the project's ~2791 lifetime transactions). The original 2023 Sanity login (`pfnsYOxNw`, `sanityUserId giXPgMfGU`, ~147 edits) **was removed on 2026-07-17**.
>
> Removal did **not** scrub history — transactions are immutable, so ~147 edits spanning 2023–2025 are still authored by `pfnsYOxNw`, and it **no longer resolves against the member list**. Looking it up now returns nothing, which reads like a mystery actor — it was the content editor (`pdGwIDhXG`). This table is the only remaining record of that, which is precisely why it lives here and not in Manage.

**General lesson — resolve identities before trusting an author tally.** One human can hold several identities across auth providers, and a removed member's id lives on in history. Map `sanityUserId` across members (`scripts/whois-author.mjs -- --author=<memberId>`) before attributing anything.

## Procedures

Get a token without exposing secrets by running scripts through the CLI's own auth:
`npx sanity exec <script> --with-user-token` populates `process.env.SANITY_AUTH_TOKEN`.

### 1. Enumerate agent-created artifacts (definitive AI trace)

```groq
*[_id in path("versions.agent-**")]{ _id, _type, _createdAt, _updatedAt }
```

Each hit is a document an Agent Action put into a release. `versions.agent-<id>.<docId>` → the release was `agent-<id>`; the payload is that document's proposed state. Cross-check its author via the per-doc history in step 3.

### 2. Transaction-author histogram (who mutates content, and how much)

The dataset-wide history API tallies every transaction's author. A human author with a huge single-instant, many-document transaction = a script/migration. A robot author = token automation.

```
GET https://zljsx9u1.api.sanity.io/v2021-06-07/data/history/prod/transactions?excludeContent=true&limit=100000
```

Response is NDJSON of `{id, timestamp, author, documentIDs}`. Group by `author`; flag robot ids and any single transaction whose `documentIDs` count is large.

### 3. Per-document forensic history

```
GET https://zljsx9u1.api.sanity.io/v2021-06-07/data/history/prod/transactions/<docId>?excludeContent=true&limit=2000
```

Gives every retained transaction for the doc: `timestamp`, `author`, transaction id (`= _rev`). **Content is gated** — `excludeContent=true` is required unless the plan includes content history retention (a 403 `"requires excludeContent to be true"` means the plan tier blocks mutation bodies). Retention by plan: **Free 3 days / Growth 90 / Enterprise 365**.

> **The asymmetry that matters.** This *metadata* (who/when) survives far beyond the retention window — on this project it reaches back to **2021** — but revision *content* does not. So you can always answer **"who changed this, and when"**, and never **"what did it say before"** past 3 days. That gap is exactly why backups, not history, are the real rollback here. See [docs/BACKUP_AND_ROLLBACK.md](../../../docs/BACKUP_AND_ROLLBACK.md).

### 4. Ground-truth diff against a backup (beats retention limits)

When history is truncated or content is gated, **diff backups** — this is how the `commonName` incident was actually dated to the Dec-2025 migration.

**Preferred — the private `oe-dataset-backups` repo** (weekly `--raw` snapshots of `prod-data.ndjson`, committed only when content changed, so every commit is a real change):

```bash
git log --oneline -- prod-data.ndjson                              # the backup timeline
git diff <old-sha> <new-sha> -- prod-data.ndjson                   # exactly which documents changed
git show <sha>:prod-data.ndjson | jq -c 'select(._id=="<docId>")'  # one doc as of that snapshot
```

**Legacy — dated full exports** in the local `oe-dataset-backups/<date>/` folders (gzipped tar):

```bash
tar -xzOf backup.tar.gz '*/data.ndjson' | grep -m1 '"<docId>"' | jq '.<field>'
```

Compare a field across two snapshots to bound *when* a value changed, independent of history retention.

### Reusable helpers

`scripts/scan-authors.mjs` (author histogram + agent-doc history) and `scripts/investigate-history.mjs` (per-doc timeline; pass `-- <docId> …`) implement steps 2–3; `scripts/whois-author.mjs` resolves an identity (`-- --author=<id>`) to a member/robot/name. Run with `npx sanity exec <script> --with-user-token`.

## Rollback & review options

**On Free, Studio history is a 3-day net — backups are the real rollback.** (Confirmed on this project: you cannot see further back in Studio.) For scale: the `commonName` corruption went **undetected for ~7 months**, so anything with a short expiry would not have saved us.

- **Backups — the primary path.** Weekly `--raw` snapshots are committed to the private `oe-dataset-backups` repo; `git log` is the timeline, `git diff` shows which documents changed, `git show <sha>:prod-data.ndjson` recovers any point. Full runbook: [docs/BACKUP_AND_ROLLBACK.md](../../../docs/BACKUP_AND_ROLLBACK.md).
- **Studio document history** — open a doc → status pill / `…` → History; revert to a prior revision. **Only useful inside the 3-day window.**
- **Compare document versions** — Studio side-by-side diff view (same 3-day limit).
- **Content Releases** — if agent changes went to a release, review/discard the whole release before publishing.
- **Dataset export restore** — `sanity dataset import <backup.tar.gz> prod --replace` (destructive full replace; last resort, take a fresh export first). Prefer a **targeted patch** of the affected documents over `--replace`.
- The Content Agent has **no internal rollback** and **cannot publish or delete** — a human accepts changes (as drafts or a release) and publishes.
- **Sanity's native Backups feature is Enterprise-only** — not available here.

## Guardrails for content authors — what is actually available

**Role availability is plan-gated, and this project is on Free. There is no "edit but not publish" role here.** Don't plan around a permission that doesn't exist on the plan.

| Plan | Assignable roles |
| --- | --- |
| **Free** ← this project | Administrator, Viewer (legacy `editor` members exist → likely *legacy* free) |
| **Growth** | + Editor, Developer, **Contributor** (writes drafts, **cannot publish**) |
| **Enterprise** | + custom roles, GROQ content resources, user attributes |
| Tokens (all plans) | Editor Token (read+write), Viewer Token (read-only) |

- **The no-publish guardrail (Contributor) requires Growth.** On Free the practical choice is Administrator vs Viewer — an author who must edit can also publish.
- **AI spending limits are moot on Free.** Free / Growth-Trial / legacy-free projects *without a credit card* have **hard caps and no overages** — when the free monthly AI credits run out, AI simply stops (an overage allowance never engages). The cap is already absolute; there is nothing to configure. Per-user AI usage is visible at Manage → Usage.
- **What actually works on Free:** migration discipline (dry-run + fresh export + **commit the script**, never delete it — the `commonName` incident came from a deleted, never-committed migration, not from the agent); least-privilege dedicated tokens; keeping Administrator minimal; and **backups** as the real control.
- **Route agent output to Content Releases** rather than direct drafts, so bulk AI edits are reviewed as a unit.
- Because AI acts within a user's permissions, **restricting the user restricts the agent** acting on their behalf.
- **Enterprise-only** custom roles / content resources carry a fail-open gotcha: a null `user::attributes()` can silently grant access; guard with `coalesce()` / `!= null`.
- **Growth is the single lever** that would unlock three wanted things at once: the Contributor no-publish role, 90-day history, and AI past the free credits.

## Related

- Incidents/research this skill grew out of: Issues #304 (commonName overwrite) and #305 (audit tooling + findings).
- `sanity-migrations` skill for safe write/rollback workflow.
