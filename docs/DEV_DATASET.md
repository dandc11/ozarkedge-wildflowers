# Dev Dataset

## Why this exists

Prior to this, all local development and schema/content experimentation ran
directly against `prod` — the same dataset the live site and hosted Studio
read from. That's risky for schema migrations, experimental content models,
or bulk operations: a mistake isn't isolated to a throwaway environment, it's
immediately live. See #301.

## What exists today

A `dev` dataset already exists in the Sanity project (private ACL, separate
from `prod`). It starts out **empty** — populate it with `npm run
sanity:sync-dev` before using it (see below).

## Sync strategy: one-way, on-demand

Of the three options considered in #301 — scheduled periodic replacement,
on-demand snapshot, or two-way merge — **on-demand snapshot** is the choice:

- **Scheduled replacement** needs a recurring GitHub Action holding a Sanity
  token as a repo secret, for a dataset that's touched occasionally, not
  continuously. Not worth the standing infrastructure and credential surface
  for how this project actually uses `dev`.
- **Two-way merge** solves a problem this project doesn't have — nothing
  currently expects dev-only content to persist across refreshes. Real
  conflict-resolution complexity for no corresponding need.
- **On-demand snapshot** matches how `dev` actually gets used: refresh it
  right before schema work that should be validated somewhere other than the
  hosted Studio (e.g. before #310's Phase 3 schema conversion), not on a
  timer.

This can change later if the usage pattern changes — nothing else here
depends on it staying this way.

## Refreshing `dev` from `prod`

```bash
npm run sanity:sync-dev
```

Equivalent to:

```bash
sanity dataset export prod .sanity-dev-sync.tar.gz --overwrite
sanity dataset import .sanity-dev-sync.tar.gz dev --replace
rm .sanity-dev-sync.tar.gz
```

This only **reads** `prod` and **writes** `dev` — it cannot mutate `prod`
either way. `--replace` overwrites same-ID documents in `dev` on repeat runs,
so re-running it is always safe and gives you a fresh copy. The intermediate
tarball is scratch state (gitignored) — it's copied through the local
filesystem because export and import are separate CLI commands, not
streamed directly dataset-to-dataset.

Requires being logged in locally (`npx sanity login`) with access to the
project — no dedicated API token needs to be created or stored for this
manual workflow. (A token would only be needed to run this non-interactively,
e.g. from CI — out of scope while this stays on-demand.)

## Developing against `dev` locally

Set in your `.env.local` (see [README.md](../README.md#required-environment-variables)):

```
NEXT_PUBLIC_SANITY_DATASET=dev
SANITY_STUDIO_DATASET=dev
```

`sanity.config.js` and `sanity.cli.js` already resolve the dataset entirely
from these env vars — no code changes are needed to point local development
at `dev` instead of `prod`.

## Verifying `dev` and `prod` stay independent

- `npm run sanity:sync-dev` only ever names `prod` as the export source and
  `dev` as the import target — there's no path in that script that writes to
  `prod`.
- Local development pointed at `dev` (via the env vars above) writes through
  `sanityFetch`/the Sanity client to whichever dataset `NEXT_PUBLIC_SANITY_DATASET`
  names — set it to `dev` and every local mutation (Studio edits, migration
  test-runs) lands there, not in `prod`.
- The existing `npm run sanity:backup`/`sanity:backup-json` scripts
  (`docs/BACKUP_AND_ROLLBACK.md`) are unaffected — they still name `prod`
  explicitly and aren't part of this sync path.
