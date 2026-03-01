---
description: 'Pre-PR self-review: accessibility, pattern compliance, security, and missing tests'
agent: plan
tools:
  - search/codebase
  - read/terminalLastCommand
  - search/changes
---

# Review PR

Perform a pre-PR self-review of recent changes.

## Checklist

Review the changed files and check each area:

### Pattern Compliance

- [ ] Data fetching uses `sanityFetch` (not bare `client.fetch`)
- [ ] GROQ queries are in `sanity/lib/queries.js` (not inline)
- [ ] Image queries include `lqip` and `palette` metadata
- [ ] `stegaClean` used only on non-editable values (class names, URLs, keys)
- [ ] Components use `ResponsiveImage` / `InteractiveImage` (not Next.js `<Image>`)
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

- [ ] New behavior has test coverage
- [ ] Existing tests still pass
