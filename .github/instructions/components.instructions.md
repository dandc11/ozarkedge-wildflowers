---
name: 'Component Conventions'
description: 'Component architecture, image components, Mux video, and styling rules'
applyTo: 'components/**'
---

# Component Conventions

## Styling

- Never write styles inline in components. Create CSS files in `/styles/components/`.
- Use CSS classes from existing stylesheets. See [styles/components/](../../styles/components/).

## Image Architecture

This project uses a three-tier image system. **Never use Next.js `<Image>` directly.**

| Component          | Type             | Use when                                  |
| ------------------ | ---------------- | ----------------------------------------- |
| `ResponsiveImage`  | Server component | Static display (banners, decorative)      |
| `InteractiveImage` | Client component | Lightbox/clickable images                 |
| Next `<Image>`     | Internal only    | Wrapped by the above — never use directly |

- Pass the full Sanity image object as the `image` prop.
- Always provide `alt` text. Use `disableHover` / `disablePointer` for decorative images.
- Image queries **must** include `"lqip": asset->metadata.lqip` and `"palette": asset->metadata.palette`.
- Responsive sizes are defined in `utilities/constants.js` (`IMAGE_SIZES`).

### GROQ Pattern for Images

```groq
mainImage {
  ...,
  "palette": asset->metadata.palette,
  "lqip": asset->metadata.lqip,
}
```

## Mux Video

- Playback uses `@mux/mux-player-react` with `playbackId` only — no API credentials needed.
- Mux credentials are stored in the Sanity dataset (`secrets.mux`), not in env vars.
- Do not add `MUX_TOKEN_ID` or `MUX_TOKEN_SECRET` to `.env.local` or Vercel.

## Server vs Client

- Keep `ResponsiveImage` as a server component — never add `'use client'`.
- Only use `InteractiveImage` when client-side interactivity is needed.
- Create wrapper components if additional client-side logic is needed around server components.
