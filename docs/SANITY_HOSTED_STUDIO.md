# Sanity-Hosted Studio

The Sanity Studio is hosted by Sanity at **https://ozarkedgewildflowers.sanity.studio** rather than embedded in the Next.js app. This simplifies deployment and decouples Studio updates from site deploys.

## For Content Authors

### Accessing the Studio

- **URL:** https://ozarkedgewildflowers.sanity.studio
- Log in with your existing Sanity account credentials
- Update your bookmarks — the old `/studio` path on the site no longer serves the Studio

### What hasn't changed

- **Draft Mode / Presentation preview** works the same — click "Open in Presentation" to see a live preview of your content
- **Visual Editing** works the same — click on text elements in the preview iframe to jump to the corresponding field in the Studio
- **All plugins** are available: Structure, Presentation, Vision, Media Library, and Mux video

### What changed

- The Studio loads from `ozarkedgewildflowers.sanity.studio` instead of `ozarkedgewildflowers.com/studio`
- The Studio may receive automatic updates from Sanity (non-breaking improvements)

### Finding untagged media assets

The Media tool's search panel already supports filtering for assets that have **no tags**, so untagged uploads don't get lost:

1. Open the **Media** tool in the Studio.
2. Open the search/filter panel and add a filter on the **Tags** facet.
3. Choose the **is empty** operator (instead of picking a specific tag).

This shows only assets with no tags applied. As soon as an asset is tagged it drops out of the filtered view automatically — no manual refresh needed. All other tag filtering (searching by a specific tag, combining with other facets like folder or file type) is unaffected.

## For Developers

### Local Development

Run the Studio locally for development:

```bash
npx sanity dev
```

This starts the Studio on `http://localhost:3333` by default.

The Next.js app (`npm run dev` on port 3000) no longer serves a Studio route. For Presentation tool previews during local development, the `origin` in `sanity.config.js` defaults to `http://localhost:3000`.

### Deploying Studio Changes

After modifying `sanity.config.js`, schemas, or custom Studio components:

```bash
npx sanity deploy
```

This deploys to https://ozarkedgewildflowers.sanity.studio.

> **Required Studio dependency — do not remove `styled-components`.** With `deployment.autoUpdates: true`, `sanity deploy` validates that every Studio dependency is **declared in `package.json`** (not merely present transitively). `styled-components` is a required peer of `sanity` / `@sanity/ui` / `@sanity/vision` / `@sanity/visual-editing`. The Next.js app never imports it directly (styles live in `/styles`), so a "remove unused dependency" pass will look correct but will break `sanity deploy` with `Error: Declared dependency 'styled-components' is not installed`. Keep it declared.

### Schema Deployment

After changing schema definitions, deploy the schema to the dataset for the Dashboard:

```bash
npx sanity schema extract
npx sanity schema deploy
```

Then deploy the Studio itself:

```bash
npx sanity deploy
```

### Configuration Files

| File               | Purpose                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `sanity.config.js` | Studio configuration (plugins, presentation, document actions)                                        |
| `sanity.cli.js`    | CLI config (`studioHost: 'ozarkedgewildflowers'`, `deployment.autoUpdates: true`, `deployment.appId`) |

### Environment Variables

| Variable                        | Value                                        | Where                                   |
| ------------------------------- | -------------------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | `https://ozarkedgewildflowers.sanity.studio` | Vercel (All Environments), `.env.local` |
| `SANITY_STUDIO_SITE_URL`        | `https://ozarkedgewildflowers.com`           | Vercel (All Environments), `.env.local` |
| `NEXT_PUBLIC_SITE_URL`          | `https://ozarkedgewildflowers.com`           | Vercel (All Environments), `.env.local` |

`NEXT_PUBLIC_SANITY_STUDIO_URL` is read by the Sanity client's `stega.studioUrl` to enable click-to-edit navigation from the live site to the Studio.

`SANITY_STUDIO_SITE_URL` is used by the Presentation tool's `origin` config to know which frontend URL to load in the preview iframe.

`NEXT_PUBLIC_SITE_URL` is the public site URL used elsewhere in the app and should remain set to `https://ozarkedgewildflowers.com`.

### CORS Configuration

The following origins must be allowed in the [Sanity project settings](https://sanity.io/manage):

- `https://ozarkedgewildflowers.sanity.studio` — hosted Studio
- `https://ozarkedgewildflowers.com` — production site
- `http://localhost:3000` — local Next.js dev server
- `http://localhost:3333` — local Studio dev server

### Custom Preview Components

These Studio preview components are bundled with the Studio and work in both embedded and hosted environments:

- `schemas/components/ImageCollectionPreview.jsx` — thumbnail grid for image collections in portable text
- `schemas/components/TeaserSectionPreview.jsx` — preview for teaser/feature blocks with title, body, and images
- `schemas/components/TextInputWithCharCount.jsx` — text input with live character count for meta descriptions

All use only Sanity-native packages (`@sanity/ui`, `@sanity/image-url`, `sanity`, `@portabletext/react`).

### Media Gallery Tags Facet

`sanity-plugin-media` (registered as `media()` in `sanity.config.js`, `^4.1.1` in `package.json`) stores per-asset tags at `opt.media.tags` and exposes a built-in `tag` search facet in the Media tool with `references` / `doesNotReference` / `empty` / `notEmpty` operators. The `empty` operator already covers "show me untagged assets" (see [For Content Authors](#finding-untagged-media-assets)) — no plugin upgrade or custom structure/GROQ view is needed for that use case. Bumping the plugin major version for other reasons should re-verify this facet still exists, since it isn't documented in the plugin's README.

### Removed Files

The following files were part of the embedded Studio and have been deleted:

- `app/studio/[[...tool]]/page.js` — Next.js route that rendered `NextStudio`
- `public/studio/index.html` — static HTML fallback
- `styles/sanity/studio.css` — CSS to hide nav/footer when Studio was active
