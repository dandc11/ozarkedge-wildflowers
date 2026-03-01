# Ozarkedge Wildflowers — Project Instructions

A Next.js 15 (App Router) site about native Arkansas wildflowers, powered by Sanity.io CMS, styled with PostCSS + custom CSS, deployed on Vercel. No TypeScript. No Tailwind CSS.

## Architecture

- **React Server Components by default.** Only add `'use client'` when hooks or browser APIs are required.
- **Data fetching**: Always use `sanityFetch` from `sanity/lib/sanity.live.js` — never bare `client.fetch`. Pass `perspective` and `stega` based on `draftMode()`.
- **GROQ queries**: Centralize in `sanity/lib/queries.js` using `GET_*_QUERY` naming. Use fragment functions from `sanity/lib/queryFragments.js`.
- **Missing data**: Check `data?._id` and call `notFound()` from `next/navigation` when absent. Use fallback pattern: `queryResponse?.data?.[0] ?? null`.
- **Images**: Use `ResponsiveImage` (server, static) or `InteractiveImage` (client, lightbox) — never Next.js `<Image>` directly. All image queries must include `lqip` and `palette` metadata.
- **Stega cleaning**: Use `stegaClean()` only for non-editable DOM values (class names, URLs, keys, data attributes). Never clean user-visible text — it needs steganography markers for Visual Editing.

## Styling

- All styles go in `/styles/` — never inline in components. Use PostCSS, CSS nesting, CSS variables, and container queries. See `styles/variables.css` and `styles/colors.css` for tokens.
- Tailwind was fully removed. Do not add Tailwind classes.

## Code Style

- Follow standard modern JS conventions (ES2022+). Use `const` by default, async/await, optional chaining, nullish coalescing, JSDoc for exported functions.
- Naming: camelCase for functions/variables, PascalCase for components, UPPER_SNAKE_CASE for constants, kebab-case for CSS classes.

## Security

- `.copilotignore` excludes `.env*` files — do not remove those entries.
- Never attach or reference `.env.local` in AI chat context. Rotate immediately if credentials are exposed.
- Mux API credentials are stored in the Sanity dataset (`secrets.mux`), not in env vars.

## Documentation

- Testing: [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)
- Sanity Live + Draft Mode: [docs/SANITY_LIVE_DRAFT_MODE.md](docs/SANITY_LIVE_DRAFT_MODE.md)
- Migrations: [docs/SANITY_MIGRATIONS.md](docs/SANITY_MIGRATIONS.md)
- Plant relationships: [docs/PLANT_RELATIONSHIPS_QUERIES.md](docs/PLANT_RELATIONSHIPS_QUERIES.md)

## Workflow

- After making code changes, offer to run the tests.
- After completing work or a todo list, ask if these guidelines should be updated based on feedback received.
- Document new patterns or practices established during work. Let the user know so it can be reviewed.
