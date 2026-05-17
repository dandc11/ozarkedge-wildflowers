# Ozarkedge Wildflowers

Next.js 15 (App Router) site about native Arkansas wildflowers. Sanity.io CMS, PostCSS, deployed on Vercel. **No TypeScript. No Tailwind CSS.**

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm test             # Run tests (Jest)
npm run test:watch   # Jest in watch mode
npm run lint         # ESLint
npm run lint:fix     # Prettier + ESLint fix
```

## Key Conventions

**Data fetching** — Always use `sanityFetch` from `sanity/lib/sanity.live.js`. Never bare `client.fetch`.

**GROQ queries** — Centralize in `sanity/lib/queries.js` using `GET_*_QUERY` naming. Use fragment functions from `sanity/lib/queryFragments.js`.

**Images** — Use `<ResponsiveImage>` (server/static) or `<InteractiveImage>` (client/lightbox). Never Next.js `<Image>` directly. Always include `lqip` and `palette` in image queries.

**Styles** — All styles go in `/styles/`. Never inline styles in components. Use PostCSS, CSS nesting, and CSS variables from `styles/variables.css` and `styles/colors.css`.

**Stega cleaning** — Use `stegaClean()` only for non-editable DOM values (class names, URLs, keys). Never clean user-visible text.

**Missing data** — Check `data?._id` and call `notFound()` when absent.

## Git Workflow

- Branch format: `feature/issue-{NUMBER}-{slug}`
- PR title format: `Closes #{NUMBER}: Description`
- Sanity Studio is hosted separately — deploy changes with `npx sanity deploy`

## Docs

- [Testing guide](docs/TESTING_GUIDE.md)
- [Sanity Live + Draft Mode](docs/SANITY_LIVE_DRAFT_MODE.md)
- [Plant relationships queries](docs/PLANT_RELATIONSHIPS_QUERIES.md)
