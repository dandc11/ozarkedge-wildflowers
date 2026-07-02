---
name: pr-self-review
description: Repo-specific pre-PR self-review checklist covering pattern compliance, accessibility, styles, security, and testing for this Next.js + Sanity project. Use before opening a PR or when asked to review the current diff against this project's conventions specifically (as opposed to general code quality).
---

# PR Self-Review

Repo-specific pre-PR checklist. This is distinct from the general-purpose `code-review` skill — it checks conformance to this project's own documented conventions (CLAUDE.md, sanity-code and CSS instructions) rather than general code quality.

## When to Use This Skill

- Before opening a PR, to self-check recent changes
- When asked to review a diff specifically against this repo's conventions

## Checklist

Review the changed files and check each area:

### Pattern Compliance

- [ ] Data fetching uses `sanityFetch` (not bare `client.fetch`)
- [ ] GROQ queries are in `sanity/lib/queries.js` (not inline) — see the `groq-queries` skill
- [ ] Image queries include `lqip` and `palette` metadata
- [ ] `stegaClean` used only on non-editable values (class names, URLs, keys)
- [ ] Components use `ResponsiveImage` / `InteractiveImage` (not Next.js `<Image>`) — see the `image-components` skill
- [ ] Missing data handled with `notFound()` checking `_id`
- [ ] CSS classes added actually exist in `/styles/` (no inline styles, no Tailwind)

### Accessibility

- [ ] All images have appropriate `alt` text
- [ ] Interactive elements have accessible names/roles
- [ ] Semantic HTML used (headings, landmarks, lists)

### Styles

- [ ] Styles in `/styles/` directory (not inline)
- [ ] Uses CSS variables for colors, spacing, typography
- [ ] Class names are kebab-case and semantic

### Security

- [ ] No `.env` values exposed
- [ ] No credentials hardcoded

### Testing

- [ ] New behavior has test coverage — see the `testing` skill
- [ ] Existing tests still pass (`npm test`)

## Also Verify Before Opening the PR

- [ ] Branch name matches `feature/issue-{NUMBER}-{slug}` — see the `github-issue-and-branch-workflow` skill
- [ ] PR title starts with `Closes #{NUMBER}:` or `Fixes #{NUMBER}:` matching the issue number in the branch name
