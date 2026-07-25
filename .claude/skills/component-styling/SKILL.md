---
name: component-styling
description: Component styling conventions in this project — the styles/ directory split, token usage, container-query-first responsive design, kebab-case naming, the three-tier image architecture, and the no-Tailwind constraint. Use when writing or reviewing CSS for a component or page, or wiring up a new component's styles.
---

# Component Styling Conventions

Consolidated guidance for styling components and pages in the ozarkedge-wildflowers project. Ports the styling rules previously spread across `.github/instructions/css.instructions.md` and `.github/instructions/components.instructions.md`.

## Core Rules

- **All styles go in `/styles/`** — never inline styles in components or JS files (`style={{...}}`). See "Data-driven values" below for the one exception pattern.
- **No Tailwind.** Tailwind was fully removed from this project — never add Tailwind utility classes, even ones that look harmless.
- Use PostCSS with CSS nesting, kept to 3–4 levels max.
- Class names: kebab-case, descriptive, semantic (not utility-first).

## File Organization

- Component styles: `styles/components/{component-name}.css`
- Page styles: `styles/pages/{page-name}.css`
- Utility classes: `styles/utility/`
- Each file is imported by `styles/global.css`. Add new files there.

## Tokens

Never hardcode colors, spacing, or type values that already have a token — reference `styles/variables.css`, `styles/colors.css`, and `styles/seasons.css`. **Don't duplicate the exact token scales here**; they change as the design system evolves (currently mid-migration in several open issues) and drift out of sync with docs that copy them. Look them up in:

- **[DESIGN.md](../../../DESIGN.md)** — canonical reference for what tokens exist and what they're for: the `--oe-*` color tiers, the season model (`--season-*` in `styles/seasons.css`), the `--fs-*`/`--fw-*` type scale, the `--sp-*` spacing scale, elevation (`--shadow-*`), and shape (`--br-*`) tokens.
- **[docs/CSS_GUIDELINES.md](../../../docs/CSS_GUIDELINES.md)** — canonical reference for _how_ to write CSS: units (rem vs. px), container-query rules, cascade/file-organization conventions, and the data-driven-values pattern.

Any change, addition, or removal of tokens or a major style pattern updates DESIGN.md in the same PR (CLAUDE.md sync rule) — this skill is not the place to record that.

## Responsive Design

- **Container queries are the default** for component responsiveness — components respond to their container, not the viewport. Read docs/CSS_GUIDELINES.md's "Container queries" section before containerizing — some layouts (content-sized boxes, intrinsic-sizing grid/flex items, genuinely viewport-bound UI like the fixed nav) must **not** be containerized.
- Media queries (`@media screen and (min-width: {breakpoint})`) are for the exceptions above and for viewport-bound behavior. Pick breakpoints from the canonical set documented in docs/CSS_GUIDELINES.md — don't invent a new one.
- Mobile-first: base styles first, then larger breakpoints.
- Use `clamp()` for fluid typography, e.g. `font-size: clamp(1.5rem, 5vw, 2.5rem)`.
- Use logical properties (`padding-inline`, `margin-block`) instead of directional ones.

## Data-Driven Values

Never inline `style={{...}}` with CSS properties. When a value must come from data (Sanity content, computed state), bridge it through an **inline custom property** that a static CSS rule consumes — e.g. a component sets `style={{ '--ns-bg': color }}`, and `natureserve.css` does the actual styling off `var(--ns-bg)`. This keeps all real styling in `/styles/` while still allowing per-instance data.

## Three-Tier Image Architecture

**Never use Next.js `<Image>` directly.**

| Component          | Type             | Use when                                  |
| ------------------ | ---------------- | ----------------------------------------- |
| `ResponsiveImage`  | Server component | Static display (banners, decorative)      |
| `InteractiveImage` | Client component | Lightbox/clickable images                 |
| Next `<Image>`     | Internal only    | Wrapped by the above — never use directly |

- Pass the full Sanity image object as the `image` prop; always provide `alt` text.
- Image queries **must** include `"lqip": asset->metadata.lqip` and `"palette": asset->metadata.palette`.
- Responsive sizes are defined in `utilities/constants.js` (`IMAGE_SIZES`).
- See the `image-components` skill for the full component API and GROQ fragment reference.

## Mux Video

- Playback uses `@mux/mux-player-react` with `playbackId` only — no API credentials needed client-side.
- Mux credentials live in the Sanity dataset (`secrets.mux`), not env vars — never add `MUX_TOKEN_ID`/`MUX_TOKEN_SECRET` to `.env.local` or Vercel.

## Server vs. Client Components

- Keep presentational components (like `ResponsiveImage`) as server components — never add `'use client'` unless hooks or browser APIs are required.
- Only use the client variant (`InteractiveImage`) when client-side interactivity is actually needed.
- If a server component needs a bit of client-side behavior, wrap it in a small client component rather than converting the whole thing.
