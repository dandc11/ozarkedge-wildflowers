# Ozarkedge Wildflowers

Next.js 16 (App Router) site about native Arkansas wildflowers. Sanity.io CMS, PostCSS, deployed on Vercel. **JS-first — TypeScript is used only where convenient (Server Actions in `app/actions.ts`, migration scripts under `migrations/`). No Tailwind CSS. Tailwind was fully removed — do not add Tailwind classes.**

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm test             # Run tests (Jest)
npm run test:watch   # Jest in watch mode
npm run lint         # ESLint
npm run lint:fix     # Prettier + ESLint fix
```

## Architecture

- **Sanity Studio** is hosted by Sanity at `https://ozarkedgewildflowers.sanity.studio` (not embedded in the Next.js app). Deploy Studio changes with `npx sanity deploy`. See `docs/SANITY_HOSTED_STUDIO.md`.
- **React Server Components by default.** Only add `'use client'` when hooks or browser APIs are required.
- **Missing data** — Check `data?._id` and call `notFound()` from `next/navigation` when absent. Use fallback pattern: `queryResponse?.data?.[0] ?? null`.

## Key Conventions

**Data fetching** — Always use `sanityFetch` from `sanity/lib/sanity.live.js`. Never bare `client.fetch`. Pass `perspective` and `stega` based on `draftMode()`.

**GROQ queries** — Centralize in `sanity/lib/queries.js` using `GET_*_QUERY` naming. Use fragment functions from `sanity/lib/queryFragments.js`.

**Images** — Use `<ResponsiveImage>` (server/static) or `<InteractiveImage>` (client/lightbox). Never Next.js `<Image>` directly. Always include `lqip` and `palette` in image queries.

**Styles** — All styles go in `/styles/`. Never inline styles in components. Use PostCSS, CSS nesting, and CSS variables from `styles/variables.css` and `styles/colors.css`.

**Stega cleaning** — Use `stegaClean()` only for non-editable DOM values (class names, URLs, keys, data attributes). Never clean user-visible text — it needs steganography markers for Visual Editing.

**Draft content & automated preview tools** — Draft-only Sanity content (unpublished edits) is invisible to automated browser/preview tooling, since the default `sanityFetch` perspective is `published` and Draft Mode requires hitting `/api/draft-mode/enable` with a secret from `.env.local`. Never read or expose that secret to enable Draft Mode programmatically. When verifying UI changes that depend on unpublished content, ask the developer for a screenshot instead.

## Code Style

- ES2022+: `const` by default, async/await, optional chaining, nullish coalescing, JSDoc for exported functions.
- Naming: camelCase for functions/variables, PascalCase for components, UPPER_SNAKE_CASE for constants, kebab-case for CSS classes.

## Security

- Never attach or reference `.env.local` in AI chat context. Rotate immediately if credentials are exposed.
- Mux API credentials are stored in the Sanity dataset (`secrets.mux`), not in env vars.

## Git Workflow

- Branch format: `feature/issue-{NUMBER}-{slug}` — GitHub Actions auto-creates the branch when an issue is opened
- PR title format: `Closes #{NUMBER}: Description` or `Fixes #{NUMBER}: Description`. The `validate-pr-linking` Action **requires** the title to start with `Closes #N`/`Fixes #N` where `N` matches the issue number in the branch name — a non-conforming title (e.g. `… (part of #N)`) fails the check. This means **one issue per PR**: for follow-up or sub-tasks of an umbrella issue, open a dedicated issue (so its own `Closes #N` is accurate) rather than pointing multiple PRs at the umbrella.
- Always assign `dandc11` when creating issues; use the `/create-issue` prompt for issue creation
- Workflow: issue created → GitHub Actions creates branch → check out branch → commit/push → PR → merge

See `docs/BRANCH_AUTOMATION_SETUP.md` for full automation details.

## Docs

- [Testing guide](docs/TESTING_GUIDE.md)
- [Sanity Live + Draft Mode](docs/SANITY_LIVE_DRAFT_MODE.md)
- [Sanity Hosted Studio](docs/SANITY_HOSTED_STUDIO.md)
- [Sanity Migrations](docs/SANITY_MIGRATIONS.md)
- [Branch automation setup](docs/BRANCH_AUTOMATION_SETUP.md)
- [Plant relationships queries](docs/PLANT_RELATIONSHIPS_QUERIES.md)
