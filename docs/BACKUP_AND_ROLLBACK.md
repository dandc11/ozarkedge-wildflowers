# Backup & Rollback

## Why this exists

This project is on Sanity's **Free plan**, where document history is retained for **3 days**. There's an asymmetry worth internalising:

- Transaction **metadata** (who changed something, and when) survives for **years** — see the `agent-activity-audit` skill.
- Revision **content** (what it said before) is **gone after 3 days**, and is plan-gated in the API.

So Sanity can always tell you *who/when*, and never *what it said before*. **Backups are the only real rollback.** Sanity's own Backups feature is Enterprise-only and unavailable to us.

For scale: the `growingNearbyPlantList[].commonName` corruption was introduced **2025-12-26** and discovered **2026-07-15** — a **~7-month detection lag**. Any backup scheme with a short expiry would have been useless. That's why backups go to a git repo with no expiry rather than to CI artifacts.

## Two kinds of backup

| Kind | Size | Time | Cadence | What it covers |
| --- | --- | --- | --- | --- |
| **Lightweight (`--raw`)** | ~1.4 MB gzipped (~7 MB as committed ndjson) | ~3 s | **weekly, automated** | Every document (~3,128), **including drafts**, with asset references intact. Covers content incidents — the realistic failure mode. |
| **Full (with assets)** | ~922 MB | several min | occasional / manual | The above **plus** every image/file binary. Disaster recovery only. |

`--raw` keeps asset *references* and the `sanity.imageAsset` metadata documents; it just doesn't download the binaries. Since the binaries still live in Sanity and rarely change, a `--raw` snapshot restores content fully. (Don't use `--no-assets` — it *strips* asset references, which is not what you want in a backup.)

```bash
# lightweight — what the automation runs
npx sanity dataset export prod /tmp/raw.tar.gz --raw

# full — occasional, for disaster recovery
npx sanity dataset export prod ./oe-dataset-backups/$(date +%m-%d-%y)/backup-$(date +%Y%m%d).tar.gz
```

## Where backups live

- **Automated:** the private **`oe-dataset-backups`** GitHub repo — a single tracked `prod-data.ndjson`, sorted by `_id`. A GitHub Action in that repo runs weekly, exports, and commits **only if content changed**.
  - `git log` is the backup timeline. `git diff` is a content changelog. Nothing expires.
- **Full/legacy:** local `~/DevProjects/oe-dataset-backups/<date>/` tarballs (incl. the pre-fix `07-15-26` snapshot).

## How the automated backup works

Weekly cron (+ manual `workflow_dispatch`) → `sanity dataset export prod --raw` → extract `data.ndjson` → sort by `_id` → write `prod-data.ndjson` → commit.

Git supplies change-detection for free: **if no content changed, there's no diff, so no commit** — quiet weeks are automatically a no-op, busy weeks get a snapshot. Sorting keeps diffs meaningful (a changed line = a changed document).

**`sanity.previewUrlSecret` documents are excluded.** They carry a live draft-mode secret, and since git history is permanent, committing one would preserve that credential forever in every clone. They also churn whenever anyone opens Presentation, which would produce meaningless "backup" commits. They're ephemeral auth rather than content, and Sanity regenerates them on demand. If you add other secret-bearing or ephemeral document types later, exclude them in the same `jq` filter. (A snapshot is therefore ~3,127 docs / 13 drafts, not 3,128 / 14.)

The workflow lives **in the backup repo** and commits to itself with the built-in `GITHUB_TOKEN`, so the only credential anywhere is `SANITY_AUTH_TOKEN` (a dedicated read-only Sanity token).

## Restore procedures

### 1. Targeted restore — preferred, and the incident case

Recover specific documents/fields without touching anything else.

```bash
# find when it changed
git log --oneline -- prod-data.ndjson
git diff <old-sha> <new-sha> -- prod-data.ndjson

# pull one document as of a known-good snapshot
git show <sha>:prod-data.ndjson | jq -c 'select(._id=="<docId>")' > /tmp/good.json
```

Then write a small, idempotent, dry-run-first migration that patches just the affected fields — see `migrations/fix-nearby-commonname/` for a worked example, and the `sanity-migrations` skill for the safety checklist. **Prefer this over a full import.**

### 2. Full restore — disaster recovery only

```bash
npx sanity dataset import <backup.tar.gz> prod --replace   # DESTRUCTIVE
```

`--replace` overwrites the whole dataset and will discard anything newer. Take a fresh export first. Last resort.

### 3. Studio history — only inside 3 days

Open the document → status pill (or `…` → History) → revert. Also **Compare document versions** for a side-by-side diff. Useless beyond the 3-day window.

## Before running any migration

The `commonName` incident came from a migration that was run live with no dry-run and then deleted. Non-negotiables:

1. **Fresh export first** (full or `--raw`).
2. **Dry-run and read the output** — every migration defaults to dry-run.
3. **Commit the script.** Never `rm -rf` a migration you ran; it's the only record of what happened.

## Verifying a backup

```bash
tar -xzOf /tmp/raw.tar.gz '*/data.ndjson' | jq -rn '[inputs] as $d |
  "docs: \($d|length)",
  "drafts: \([$d[]|select(._id|startswith("drafts."))]|length)"'
```

Expect ~3,100+ documents and a non-zero draft count. **A zero draft count means the token can't read drafts** — the backup is incomplete; check the token's role.
