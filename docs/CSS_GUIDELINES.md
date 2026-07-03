# CSS Engineering Guidelines

Engineering conventions for writing CSS in this repo. **Division of concerns:**
[DESIGN.md](../DESIGN.md) is the design-system snapshot + intent (what tokens
exist, what they're for, do/don'ts *of the system*); this file is *how we
write CSS* — the guidance that would apply even if the palette changed.
Token or pattern changes update DESIGN.md (CLAUDE.md sync rule); conventions
here change independently.

## Units

- **rem for spacing and type.** Users who raise their browser's default font
  size (a setting distinct from zoom) get proportionally scaled spacing with
  rem; px would hold spacing fixed while text grows — dense, clipped layouts
  and a WCAG regression risk. The `--sp-*` scale documents px equivalents at
  the 16px root (`styles/variables.css`).
- **px for hairlines** (1px borders) and other things that deliberately must
  not scale with text.

## Spacing

- `margin` / `padding` / `gap` use the `--sp-*` scale (numeric 4px-base;
  number = px ÷ 4). Negative rhythm margins: `calc(-1 * var(--sp-*))`.
- **Positional offsets** (`top`/`left`/`bottom`/`right` of decorative
  elements) are component geometry, not spacing rhythm — raw values allowed.
- Off-scale spacing requires a justifying comment at the declaration.

## Breakpoints

Canonical set (documentation + convention — custom properties cannot appear
in `@media`/`@container` preludes): **500 · 600 · 750 · 800 · 900 · 1200 ·
1400 · 1600 px**. New queries pick from this set. Known drift pending
consolidation (#261): 820px, 1000px, 1296px.

## Container queries

Container queries are the default for component responsiveness — components
respond to the space they're given, not the viewport. But `container-type:
inline-size` imposes **inline-size containment**: the element's own width can
no longer be derived from its contents. Do **not** containerize:

1. **Content-sized boxes** — anything relying on `width: fit-content` /
   `max-content`, shrink-to-fit floats, or inline-block auto sizing.
2. **Grid/flex items that feed intrinsic sizing** — an item that contributes
   to `auto` / `min-content` track or flex-basis computation collapses or
   distorts the track once contained.
3. **Self-styling** — a container's own `@container` rules match descendants
   only; if the element must restyle *itself*, query an ancestor container.
4. **Genuinely viewport-bound UI** — fixed/full-viewport overlays (the nav
   menu) are correctly `@media`; converting them adds indirection for
   nothing.

Rule of thumb: containers should be layout **slots** with extrinsic width
(grid areas, full-width sections), not boxes sized by what's inside them.
The dev workbench (#269) provides drag-resizable harnesses for fitting a
component to its queries interactively.

## Cascade & file organization

- One file per component in `styles/components/`, pages in `styles/pages/`,
  imported by `styles/global.css`. Tier order today is **source order**
  (tokens → seasons → utilities → components → pages) — which means later
  files may override earlier custom properties deliberately (e.g. home.css
  re-points `--teaser-*` on `.blooming-now`). Formalizing this with `@layer`
  is tracked in #268.
- Avoid `!important` (and note its semantics invert inside cascade layers).

## Data-driven values

Never inline `style={{...}}` with CSS properties. Data-driven values bridge
through **inline custom properties** consumed by static CSS — e.g. the
NatureServe components set `--ns-bg`/`--ns-color`; static rules in
`natureserve.css` do the styling.

## Season styling

One mechanism: a season class on a wrapper remaps the `--season-*` aliases,
all defined in `styles/seasons.css` — the only file allowed per-season token
styling. See DESIGN.md → Seasons for the model.
