---
# design.md (https://github.com/google-labs-code/design.md) — portable design
# context for humans + AI tools. RUNTIME SOURCE OF TRUTH is /styles/*.css;
# this frontmatter mirrors the SEMANTIC tier by hand — update both together.
version: alpha
name: Ozarkedge Wildflowers
colors:
  primary: hsl(0, 100%, 25%) # --oe-primary → --oe-red-700 (brand red)
  secondary: hsl(192, 33%, 38%) # --oe-secondary → --oe-blue-green-dark-700 (teal; AA on white)
  surface: hsl(0, 0%, 100%) # --oe-surface
  on-surface: hsl(240, 3%, 15%) # --oe-on-surface → --oe-text-body
  error: hsl(0, 100%, 38%) # --oe-error → --oe-red-500 (6.38:1 on white)
  outline: hsl(0, 0%, 88%) # --oe-outline → --oe-grey-200 (hairline only)
  surface-muted: hsl(0, 0%, 96%) # --oe-surface-muted → --oe-grey-100
  link: hsl(217, 91%, 60%) # --oe-link (large text only, 3.64:1)
typography:
  headline-display:
    fontFamily: Playfair Display
    fontWeight: 700
  body-md:
    fontFamily: Raleway
    fontSize: 1.125rem
    fontWeight: 400
  label-md:
    fontFamily: Raleway
    fontSize: 0.875rem
    fontWeight: 500
spacing:
  # numeric 4px-base scale — number = px ÷ 4 at the 16px root (--sp-{n})
  1: 0.25rem # 4px
  2: 0.5rem # 8px
  3: 0.75rem # 12px
  4: 1rem # 16px
  5: 1.25rem # 20px
  6: 1.5rem # 24px
  8: 2rem # 32px
  10: 2.5rem # 40px
  12: 3rem # 48px
  16: 4rem # 64px
  24: 6rem # 96px
  32: 8rem # 128px
  48: 12rem # 192px
  64: 16rem # 256px
  96: 24rem # 384px
rounded:
  sm: 0.125rem
  md: 0.375rem
  lg: 0.5rem
  pill: 9999px
---

# Ozarkedge Wildflowers — Design System

## Overview / Brand & Voice

A photography-led field guide to native wildflowers of the Arkansas Ozarks.
**Photography is the brand** — design anchors the visitor and must never
compete with the imagery. No wordmark. Voice is calm, plain-spoken, and
field-guide accurate: name the plant, the season, the place.

The token system is deliberately minimal and lives in `/styles/` as CSS
custom properties (no Tailwind, no CSS-in-JS, no token build pipeline).
This file is the portable reference both developers and AI tools read;
`styles/*.css` is the runtime source of truth.

## Colors

Three tiers, loaded in this order by `styles/global.css`:

1. **Primitive** — raw 9-step hue ramps in `styles/colors.css`:
   `--oe-{hue}-{100..900}` for grey, yellow, orange, green, green-yellow,
   blue-green-light, blue-green-dark, blue-dark, purple, pink, red.
   Components should rarely touch these directly.
2. **Semantic** — the working set (mirrored in the frontmatter above):
   `--oe-primary`, `--oe-secondary`, `--oe-surface`, `--oe-on-surface`,
   `--oe-error`, `--oe-outline`, `--oe-surface-muted`, `--oe-link`.
   Each references a primitive; contrast rationale is commented inline
   in `colors.css`. **New component colors reference this tier.**
3. **Component** — component-scoped vars (`--nav-*`, `--btn-*`,
   `--teaser-*`) that reference semantic or season aliases.

Fixed palettes that are **never** restyled: the 7 NatureServe conservation
status colors (`--oe-presumed-extirpated` … `--oe-secure`) — domain
semantics, set inline as `--ns-bg`/`--ns-color` custom-property bridges by
the NatureServe components.

### Seasons

One switching mechanism: a season class (`spring | summer | fall | winter`)
on a wrapper element remaps the `--season-*` aliases for its subtree — all
defined in **`styles/seasons.css`** (the only file allowed per-season token
styling). `<body>` carries the current-date season (`app/layout.js`); season
pages apply their Sanity `seasonName`; teaser/feature sections apply their
Sanity `featureTheme`. Nested wrappers win via cascade, and every season
block sets the full alias set so nesting can't leak values. The raw
per-season palette (`--spring-*`, gradients, teaser tints) lives in
`colors.css`.

## Typography

- **Playfair Display** (`--font-playfair-display`) — display headings and
  season titles. Weights 400/700/900 + italics.
- **Raleway** (`--font-raleway`) — body, UI, captions, eyebrows.
- Type scale: `--fs-xxs` (0.75rem) → `--fs-10xl` (10rem); weights
  `--fw-100..900` (`styles/variables.css`). Utility classes in
  `styles/utility/typography.css`.

## Layout & Spacing

- **Spacing scale**: numeric 4px-base — `--sp-1` (4px) → `--sp-96` (384px),
  where the number is the px value ÷ 4 at the 16px root
  (`styles/variables.css`). rem units so spacing tracks the user's font-size
  preference. New steps insert by number without renaming neighbors.
  `margin` / `padding` / `gap` use the scale; negative rhythm margins use
  `calc(-1 * var(--sp-*))`. Utility class names (`.m-xxs`, `.p-in-md`, …)
  are a separate naming layer and keep their t-shirt sizes.
- **Positional offsets** (`top`/`left`/`bottom`/`right` of decorative
  elements) are component geometry, not spacing rhythm — raw values allowed.
- **Breakpoints** (documentation-only set; custom properties can't appear in
  `@media`/`@container` preludes): 500 · 600 · 750 · 800 · 900 · 1200 ·
  1400 · 1600 px. New queries pick from this set.
- **Container queries are first-class** — components respond to their
  container, not the viewport, except where genuinely viewport-bound (the
  fixed nav overlay). Engineering guidance — including when **not** to
  containerize — lives in [docs/CSS_GUIDELINES.md](docs/CSS_GUIDELINES.md).

## Elevation & Depth

`--shadow-sm | md | lg | xl` (`styles/variables.css`). Cards use `md`,
lifted imagery `lg`. No ad-hoc box-shadows.

## Shapes

`--br-sm | md | lg | pill` (`styles/variables.css`). `pill` (9999px) for
fully-rounded controls; imagery uses `lg`.

## Components

Component styling lives in **`styles/components/*.css`** (one file per
component, imported by `global.css`) with markup in `/components/*.js`.
**Read those files rather than re-deriving components from this document** —
notable ones: `nav.css`, `button.css` (incl. `.btn-season`), `teaser.css`,
`footer.css`, `natureserve.css`, `image.css` (see the `image-components`
skill for the ResponsiveImage/InteractiveImage tiers).

## Do's and Don'ts

- **Do** consume the semantic tier (`--oe-primary` etc.) and season aliases
  (`--season-*`); **don't** hardcode color literals or reference
  `--{season}-*` palette values outside `styles/seasons.css`.
- **Do** use `--sp-*` for margin/padding/gap; **don't** introduce off-scale
  spacing without a comment justifying the exception.
- **Don't** use Tailwind classes (fully removed), CSS-in-JS, or inline
  `style={{...}}` — data-driven values bridge through inline **custom
  properties** consumed by static CSS.
- **Don't** use Next.js `<Image>` directly — `ResponsiveImage` /
  `InteractiveImage` only.
- **Do** keep this file and `/styles/*.css` in sync when tokens change —
  CSS is the runtime truth, this file is the portable mirror.
