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

| File               | Purpose                                                                |
| ------------------ | ---------------------------------------------------------------------- |
| `sanity.config.js` | Studio configuration (plugins, presentation, document actions)         |
| `sanity.cli.js`    | CLI config (`studioHost: 'ozarkedgewildflowers'`, `autoUpdates: true`) |

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

### Removed Files

The following files were part of the embedded Studio and have been deleted:

- `app/studio/[[...tool]]/page.js` — Next.js route that rendered `NextStudio`
- `public/studio/index.html` — static HTML fallback
- `styles/sanity/studio.css` — CSS to hide nav/footer when Studio was active
