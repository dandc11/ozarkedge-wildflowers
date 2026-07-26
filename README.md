# Ozarkedge Wildflowers

Source for the [Ozarkedge Wildflowers](https://ozarkedgewildflowers.com/) site — a field guide to the native wildflowers of northeastern Arkansas, built with Next.js (App Router) and the Sanity.io CMS.

| | |
|---|---|
| **Host** | Vercel |
| **URL** | https://ozarkedgewildflowers.com/ |
| **Framework** | Next.js 16 (App Router, React Server Components) |
| **CMS** | Sanity.io (hosted Studio) |
| **Styling** | PostCSS + custom CSS (no Tailwind) |
| **Language** | JavaScript-first; TypeScript only where convenient (Server Actions, migrations) |
| **Tests** | Jest + Testing Library |
| **Repo** | https://github.com/dandc11/ozarkedge-wildflowers |
| **Project board** | https://github.com/users/dandc11/projects/1 |

## Prerequisites

- **Node.js 22.x** (see the `engines` field in `package.json`)
- npm
- Access to the project's Sanity dataset (for content) — see [Required environment variables](#required-environment-variables)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file and fill in the values (see below)
#    .env.local is git-ignored — never commit it.
touch .env.local

# 3. Start the dev server
npm run dev
```

The site runs at http://localhost:3000.

## Required environment variables

Add these to `.env.local` (git-ignored). Values come from the Sanity project settings and the team's secret store — they are **not** checked into the repo.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | Sanity project ID used by the client |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | Sanity dataset name — `prod` for the live site, or `dev` for local development against the isolated dev dataset (see [docs/DEV_DATASET.md](docs/DEV_DATASET.md)) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | optional | Sanity API version date (defaults to `2024-10-28` if unset) |
| `SANITY_API_READ_TOKEN` | ✅ | Server-side read token for Draft Mode / authenticated reads |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | optional | URL of the hosted Studio, used for "open in Studio" links |
| `NEXT_PUBLIC_LIGHTBOX_LICENSE_KEY` | optional | License key for `lightbox.js-react` |

> The Draft Mode preview secret is **not** an env var — it is stored in the Sanity dataset (`preview.secret`). See [docs/SANITY_LIVE_DRAFT_MODE.md](docs/SANITY_LIVE_DRAFT_MODE.md).

## npm scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm test` | Run the Jest test suite |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:coverage` | Jest with coverage report |
| `npm run lint` | ESLint |
| `npm run lint:fix` | Prettier + ESLint autofix |
| `npm run format` | Prettier write |
| `npm run analyze` | Production build with the bundle analyzer (`ANALYZE=true`) |
| `npm run migrate` | Run the Sanity content migration script |
| `npm run sanity:backup` | Export the `prod` dataset to `backups/` |
| `npm run sanity:sync-dev` | Refresh the `dev` dataset with a fresh copy of `prod` (see [docs/DEV_DATASET.md](docs/DEV_DATASET.md)) |

## Sanity Studio

The Studio is **hosted by Sanity** at https://ozarkedgewildflowers.sanity.studio — it is **not** embedded in this Next.js app. Studio configuration and schemas live in `sanity.config.js`, `sanity/`, and `schemas/`. Deploy Studio changes with:

```bash
npx sanity deploy
```

See [docs/SANITY_HOSTED_STUDIO.md](docs/SANITY_HOSTED_STUDIO.md) for details.

## Project layout

```
app/         Next.js App Router routes (RSC by default)
components/  React components
sanity/      Sanity client, queries, live/preview config, Presentation
schemas/     Sanity Studio schema definitions
styles/      PostCSS stylesheets (variables, components, pages, utilities)
utilities/   Shared helpers and constants
migrations/  Sanity content migration scripts
docs/        Project documentation
```

## Documentation

- [Testing guide](docs/TESTING_GUIDE.md)
- [Sanity Live + Draft Mode](docs/SANITY_LIVE_DRAFT_MODE.md)
- [Sanity Hosted Studio](docs/SANITY_HOSTED_STUDIO.md)
- [Branch automation setup](docs/BRANCH_AUTOMATION_SETUP.md)
- [Plant relationships queries](docs/PLANT_RELATIONSHIPS_QUERIES.md)

For internal contributor conventions (data fetching, GROQ, image components, styling rules), see [CLAUDE.md](CLAUDE.md).
