---
name: 'CSS Conventions'
description: 'PostCSS styling conventions, CSS variables, spacing tokens, typography, and responsive patterns'
applyTo: 'styles/**/*.css'
---

# CSS Conventions

## General Rules

- All styles go in `/styles/` — never inline styles in components or JS files.
- Use PostCSS with CSS nesting. Keep nesting to 3–4 levels max.
- Use kebab-case, descriptive, semantic class names.
- Never add Tailwind classes — Tailwind was fully removed in favor of PostCSS + custom CSS.

## File Organization

- Component styles: `/styles/components/{component-name}.css`
- Page styles: `/styles/pages/{page-name}.css`
- Utility classes: `/styles/utility/`

## CSS Variables & Tokens

Reference [styles/variables.css](../../styles/variables.css) and [styles/colors.css](../../styles/colors.css) for all tokens.

**Colors**: Use existing variables. New colors follow `--oe-<name>` convention. Season-specific: `--{season}-accent`, `--{season}-bg-color`.

**Spacing** (prefer these over hardcoded values — add a comment with the rem value):

- `--sp-xxs` 0.25rem, `--sp-xs` 0.5rem, `--sp-sm` 0.75rem, `--sp-md` 1rem, `--sp-ml` 1.25rem
- `--sp-lg` 1.5rem, `--sp-xl` 2rem, `--sp-2xl` 3rem, `--sp-3xl` 4rem, `--sp-4xl` 6rem
- `--sp-5xl` 8rem, `--sp-6xl` 12rem, `--sp-7xl` 16rem, `--sp-8xl` 24rem

**Typography**: Use `--fs-xxs` through `--fs-9xl` for font sizes, `--fw-100` through `--fw-900` for weights. Use `.text-display` for Playfair Display, `.text-raleway` for Raleway. See [styles/variables/typography.css](../../styles/variables/typography.css).

## Responsive Design

- Container queries preferred over media queries for component-specific behavior: `@container (min-width: 600px) { ... }`
- Media queries: `@media screen and (min-width: {breakpoint})`
- Mobile-first: base styles first, then larger breakpoints.
- Use `clamp()` for fluid typography: `font-size: clamp(1.5rem, 5vw, 2.5rem)`
- Use logical properties (`padding-inline`, `margin-block`) instead of directional ones.
