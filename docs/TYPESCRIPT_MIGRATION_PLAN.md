<!-- Research & planning doc for #310. Answers the issue's action items and
     unresolved questions; implementation is broken into separate phase issues
     once this lands (one `Closes #N` per phase PR, per the repo's PR rules). -->

# TypeScript Migration — Research & Phased Plan

## Recommendation

**Convert incrementally, adopt Sanity TypeGen first and independently of the
rest of the conversion, skip codemod tooling, and stay a permanent JS/TS
hybrid rather than commit to a big-bang or a 100%-converted end state.**

The codebase is small (~11.3k non-test source lines across 116 `.js`/`.jsx`
files — see Inventory), already disciplined (JSDoc on 28 files, no PropTypes,
no legacy class-component patterns to fight), and Next.js/Jest already
support `.ts`/`.tsx` with zero config changes. The risk here isn't technical
difficulty, it's **scope creep from converting for its own sake**. The
highest-value slice — typed GROQ query results — doesn't require converting
anything to `.ts` at all (see below), so it should ship as its own low-risk
phase 0 regardless of whether the rest of the conversion proceeds.

## Inventory

Non-test source files and lines, by area (`find`+`wc -l`, current `main`):

| Area                            | .js/.jsx files           | .ts/.tsx files   | LOC         | Test files | Test LOC   |
| ------------------------------- | ------------------------ | ---------------- | ----------- | ---------- | ---------- |
| `components/`                   | 36                       | 0                | 3,193       | 12         | 3,025      |
| `schemas/`                      | 31                       | 0                | 2,310       | 0          | 0          |
| `app/`                          | 12                       | 1 (`actions.ts`) | 1,485       | 0          | 0          |
| `sanity/`                       | 12                       | 0                | 980         | 0          | 0          |
| `tests/` (shared helpers/mocks) | 4                        | 0                | 948         | 1          | 38         |
| `utilities/`                    | 3                        | 0                | 590         | 2          | 502        |
| `migrations/`                   | 4                        | 1                | 604         | 0          | 0          |
| `scripts/`                      | 1                        | 0                | 145         | 0          | 0          |
| `hooks/`                        | 1                        | 0                | 53          | 0          | 0          |
| `contexts/`                     | 1                        | 0                | 22          | 0          | 0          |
| `__mocks__/`                    | 1                        | 0                | 17          | 0          | 0          |
| **Total**                       | **116** (+15 test files) | **3**            | **~10,800** | **15**     | **~3,565** |

The per-area rows above sum to 106 `.js`/`.jsx` files; the other 10 are
root-level config (`next.config.js`, `eslint.config.js`, `jest.config.js`,
`jest.env.js`, `jest.setup.js`, `sanity.config.js`, `sanity.cli.js`,
`postcss.config.js`, `prettier.config.js`) plus one Sanity-generated build
artifact — none of it blocks a TS conversion; Next.js, Jest, and ESLint all
resolve `.ts` config files interchangeably with `.js` ones.

Notable in scoping the effort:

- **28 files already carry JSDoc** (`@param`/`@returns`/`@type`) — a real head
  start; JSDoc-typed JS and TS share enough vocabulary that these convert
  with the least friction.
- **Zero PropTypes, zero styled-components usage** despite both being
  dependencies — no legacy typing pattern to migrate away from first.
- **`react-select` (4 files)** ships its own types — no `@types/*` package
  needed there.
- `schemas/` is the single largest area by LOC after `components/` — it's
  also the area TypeGen can make mostly redundant (see below), which changes
  its priority in the phased plan.

## tsconfig strategy

Current `tsconfig.json` is already close to a sensible incremental baseline:
`allowJs: true`, `strict: false` but `strictNullChecks: true` already
enabled (a deliberate middle ground someone already chose), `isolatedModules:
true`, `moduleResolution: "bundler"`. **Keep `allowJs` co-existence
permanently** — this project should never require a flag day where every
file becomes `.ts` at once.

Recommended target strictness, ratcheted in this order as phases land (each
flag flip is its own small PR once the prior phase's files are clean under
it):

1. `strictNullChecks` — already on.
2. `noImplicitAny` — the next one to enable; forces every newly-converted
   file to actually type its function signatures instead of leaning on
   inference gaps.
3. Full `strict: true` — deferred until most of `sanity/lib`, `utilities`,
   and `components` have converted; flipping it early on a mostly-JS
   codebase just adds noise to files that haven't converted yet.

No path alias changes needed — `@/*` already works today via both Next's
built-in resolution and Jest's `moduleNameMapper` (`jest.config.js`); TS
picks it up from the same `tsconfig.json` once a `paths` entry is added, or
can continue relying on Next's implicit handling.

## Sanity/GROQ typing (TypeGen) — do this first, independently

This is the highest-value part of the conversion, confirmed against current
Sanity docs (Sanity TypeGen, checked against the installed `sanity@5.31.1`,
which is well past TypeGen's v5.10.0 GA):

**Key finding: TypeGen does not require converting anything to TypeScript.**
Its supported file types for parsing queries explicitly include plain
`.js`/`.jsx`, and its only requirement is that a query is assigned to a
uniquely-named variable using the `groq` template-literal tag (or
`defineQuery`) — which is exactly how every query in
`sanity/lib/queries.js` is already written. So:

1. Run `sanity schema extract` (writes `schema.json`) then
   `sanity typegen generate` — no source changes required to try this today.
2. Configure it via `sanity.cli.js`'s `typegen` block (the modern
   location — the standalone `sanity-typegen.json` file is deprecated):
   ```js
   export default defineCliConfig({
     // ...existing config
     typegen: {
       path: './{app,components,sanity,schemas,utilities}/**/*.{js,jsx,ts,tsx}',
       schema: 'schema.json',
       generates: './sanity.types.ts',
     },
   })
   ```
3. The generated `sanity.types.ts` is consumable from `.js` files via JSDoc
   (`@type {import('./sanity.types').GetPlantListPageQueryResult}`) even
   before any other file converts — this is a real, shippable phase 0.
4. `--enforce-required-fields` on `schema extract` translates
   `validation: Rule.required()` into non-optional generated fields — worth
   enabling, with the documented caveat that draft/preview content can still
   be `undefined`/`null` regardless (this project's `sanityFetch` already
   distinguishes `published` vs. preview perspectives, so that caveat maps
   cleanly onto existing `draftMode()` branches).
5. Automatic client-method overloading (`overloadClientMethods`, on by
   default) means once queries are typed, `sanityFetch`/`client.fetch` call
   sites get inferred return types with no per-call annotation — valuable
   even in files that stay `.js` with JSDoc.

Net effect: **TypeGen adoption should be Phase 0, shippable regardless of
whether the rest of this plan proceeds**, and it substantially reduces the
later effort of typing `sanity/lib/*` and `schemas/*` by hand.

## Migration approach

**Incremental, file-by-file, leaf-first — not an automated codemod.**
`ts-migrate` (the tool named in the issue as a candidate) was last published
to npm in **November 2022** and shows no signs of active maintenance —
not a safe bet for a 2026 Next.js 16 / React 19 codebase. There's also no
equivalent well-maintained alternative worth adopting for a codebase this
size; a manual, leaf-first rename (start with files with the fewest internal
dependents — `utilities/`, `hooks/`, `contexts/` — then move inward toward
`components/` and finally `app/`) is small enough to do by hand per phase,
and produces better types than a mechanical codemod would (which typically
emits `any` at every boundary it can't infer, deferring the real typing
work rather than doing it).

Renaming a leaf `.js`/`.jsx` file to `.ts`/`.tsx` is a no-op for both Next.js
and Jest today (see Testing impact) — the only work per file is actually
adding types, not wiring up tooling.

## Testing impact

**No `ts-jest` needed.** `jest.config.js` already uses `next/jest`, which
transforms through Next's SWC pipeline — SWC strips TypeScript syntax
without type-checking, the same as Babel's `@babel/preset-typescript` would,
and `testMatch` already includes `**/*.{js,jsx,ts,tsx}`. A converted test
file runs today with zero config changes. Type-checking for tests (and
everything else) happens via a separate `tsc --noEmit` step, not through the
Jest transform — this is the standard modern pattern (isolated
transpilation, checking as a distinct gate) and matches `tsconfig.json`
already having `isolatedModules: true`.

One real gap: `jest.config.js`'s `collectCoverageFrom` globs are
`.js`/`.jsx`-only for `components/`, `app/`, `utilities/`, `contexts/`,
`hooks/` — each needs a `.ts,.tsx` variant added as files in that area
convert, or coverage silently drops files that moved.

Whether test files convert in the same phase as their subject or trail
behind is a per-phase call, not a global rule — a test file typed against
an already-converted component is strictly better, but there's no technical
reason to block a component's conversion on its test converting same-PR.

## Tooling/config

- **ESLint**: current `eslint.config.js` is already an ESLint 9 flat config
  (migrated recently, per its own header comment) importing
  `eslint-config-next/core-web-vitals` directly rather than through Next's
  `next/typescript` preset — so **no `@typescript-eslint` rules are active
  today even though `.ts` files already exist** (`app/actions.ts`,
  `migrations/rename-pagebodyportabletext-objects/index.ts`). Confirmed
  `@typescript-eslint/eslint-plugin@8.65.0` supports ESLint `^9.0.0`, so
  adding `eslint-config-next/typescript` (or `typescript-eslint`'s flat
  preset directly) is a drop-in addition, not a blocker.
- **Prettier**: no changes needed — `prettier.config.js`'s settings apply to
  `.ts`/`.tsx` identically.
- **CI gates — important finding, not a TS-specific gap**: this repo
  currently has **no CI workflow that runs `npm run lint`, `npm run build`,
  or `npm test`** at all (`.github/workflows/` only contains the
  branch-naming/PR-linking/project-board automations). Adding a `tsc
--noEmit` gate therefore has no existing lint/test/build CI pattern to
  slot into — recommend standing up a general CI checks workflow (lint +
  test + build, `tsc --noEmit` included once there's TS to check) as a
  near-term prerequisite, sized as its own issue rather than folded silently
  into a TS-conversion phase PR.
- **Editor DX**: no config needed beyond what's already present —
  `next-env.d.ts` and the `next` TS plugin entry in `tsconfig.json` already
  give editors Next-aware IntelliSense today, including in `.js` files with
  JSDoc.

## Phased plan

Each phase is independently mergeable and sized to become its own
`Closes #N` implementation issue, per the repo's one-issue-per-PR rule.

1. **Phase 0 — TypeGen adoption.** `sanity.cli.js` `typegen` config, generate
   `sanity.types.ts`, wire a small number of high-traffic queries
   (`GET_SITE_SETTINGS_QUERY`, `GET_NATIVE_PLANT_QUERY`-equivalent) to prove
   the types are useful via JSDoc in `.js` call sites. No file renames. Ships
   independently of everything else below.
2. **Phase 1 — Tooling.** `noImplicitAny` plan, `@typescript-eslint`/
   `next/typescript` ESLint preset, `tsc --noEmit` added to a new (or
   existing, once stood up) CI workflow, `collectCoverageFrom` glob updates.
3. **Phase 2 — Data layer.** Convert `sanity/lib/*`, `utilities/*`,
   `hooks/*`, `contexts/*` (smallest, most leaf-like, highest
   type-safety payoff relative to size — 665 combined LOC excluding tests).
4. **Phase 3 — Schemas.** Convert `schemas/*` — partially superseded in
   _effort_ by Phase 0 (TypeGen reads schema definitions regardless of
   whether they're authored in `.js` or `.ts`), so this phase is about
   type-safety of the schema-authoring code itself (`defineField`/
   `defineType` generics), not a prerequisite for TypeGen.
5. **Phase 4 — Components.** Convert `components/*` leaf-first (present
   sub-components before container components that compose them), test
   files trail or accompany per the judgment call above.
6. **Phase 5 — Routes.** Convert `app/*` pages/layouts last — they depend on
   everything above, so converting them first would mean typing against
   still-untyped dependencies.
7. **Phase 6 — Ratchet strictness.** Flip `noImplicitAny` on repo-wide (if
   not already default by then), then `strict: true` once the above phases
   are far enough along that it doesn't just add noise to un-converted files.

## Docs impact

- **CLAUDE.md** — the "JS-first" framing (line 3) stays accurate throughout
  this plan (permanent hybrid, not a conversion _to_ TypeScript-first) —
  revise it only if a future decision changes the end-state goal. No change
  needed as part of this research issue.
- **README.md** — same; its "JavaScript-first; TypeScript only where
  convenient" line already matches the recommended permanent-hybrid model.
- **Skills** — no currently-existing skill documents JS/TS framing beyond
  CLAUDE.md's Code Style section, so nothing to update today. If Phase 1
  tooling changes lint/test conventions, `pr-self-review` may need a line
  added at that point.

## Effort & risk estimate

Rough sizing (excludes Phase 0, which is hours, not days, given no file
renames are required):

| Phase                  | Size | Primary risk                                                                                                                                                    |
| ---------------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 — TypeGen            | XS   | None — additive, no renames                                                                                                                                     |
| 1 — Tooling/CI         | S    | Standing up CI from nothing is the real work here, not the TS-specific pieces                                                                                   |
| 2 — Data layer         | S–M  | `sanity/lib/sanity.live.js`/`sanity.client.js` types need to match `next-sanity`'s own generics — some friction expected here specifically                      |
| 3 — Schemas            | M    | Mostly mechanical; `defineType`/`defineField` generics can get verbose for deeply nested object/array schemas                                                   |
| 4 — Components         | M–L  | Largest LOC; Server/Client component boundary typing (`'use client'` files vs. RSC) is the main new concept, not difficulty — well-trodden ground in Next.js 16 |
| 5 — Routes             | S    | Small file count (12), but depends on 2–4 being done first                                                                                                      |
| 6 — Strictness ratchet | S    | Mostly noise-reduction work once prior phases are clean                                                                                                         |

No phase touches production data, secrets, or the Sanity dataset — the
whole migration is a build-time/dev-time concern.

## Answers to the issue's unresolved questions

- **Big-bang vs. permanent hybrid?** Permanent hybrid. `allowJs: true` stays
  forever; there's no product reason to force config files or one-off
  scripts into `.ts`.
- **Target strictness — straight to `strict: true` or ratchet?** Ratchet
  (see tsconfig strategy) — the codebase already ratcheted once
  (`strictNullChecks` is on, full `strict` is off), so this continues an
  existing pattern rather than introducing a new one.
- **TypeGen as a hard requirement or a follow-up?** Hard requirement of
  Phase 0, and independent of the rest — see above. It's the highest
  value-per-effort item in this entire plan and doesn't need to wait on
  anything.
- **One large effort or a series of phase PRs?** Series of independently
  mergeable phase PRs (as scoped above) — required anyway by the repo's
  one-issue-per-PR rule, and lets Phase 0 ship even if the team later
  decides not to pursue Phases 2–6.
