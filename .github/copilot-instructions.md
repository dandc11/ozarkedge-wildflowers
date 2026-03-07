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

## Git & Development Workflow

### Branch Naming Convention

When working on a GitHub issue, **always use this branch name format:**

```
feature/issue-{NUMBER}-{slug}
```

Where:

- `{NUMBER}` is the GitHub issue number (e.g., `178`)
- `{slug}` is a kebab-case approximation of the issue title (lowercase, words separated by dashes, max ~40 chars)

**Examples:**

- Issue #178 "SEO: Content author tasks" → `feature/issue-178-seo-content-author-tasks`
- Issue #181 "Set up Google Search Console" → `feature/issue-181-set-up-google-search-console`

**If the branch already exists** (auto-created when the issue was opened), simply check it out:

```bash
git fetch origin
git checkout feature/issue-{NUMBER}-{slug}
```

### Pull Request Linking

When creating a PR, **include the issue number in the title** using one of these formats:

```
Closes #{NUMBER}: Description
Fixes #{NUMBER}: Description
```

Example: `Closes #178: Wire Site Settings into layout metadata`

This ensures the PR is automatically linked to the issue and passes the validation checks.

### Workflow Process

1. Issue is created → branch is auto-created by GitHub Actions
2. Check out the branch and make changes
3. Commit and push to the branch
4. Create PR with issue number in title (format: "Closes #123: ...")
5. Validation workflows check branch name and PR linking
6. Once checks pass and code review is complete, merge to main

**See [docs/BRANCH_AUTOMATION_SETUP.md](docs/BRANCH_AUTOMATION_SETUP.md) for full automation details.**

## General Workflow

- After making code changes, offer to run the tests.
- After completing work or a todo list, ask if these guidelines should be updated based on feedback received.
- Document new patterns or practices established during work. Let the user know so it can be reviewed.
