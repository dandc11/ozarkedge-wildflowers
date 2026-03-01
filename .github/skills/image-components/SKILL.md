# Image Components Skill

Detailed guide to the three-tier image architecture used in this project. Use this when working with images in components, GROQ queries, or CSS.

## Three-Tier Architecture

### Tier 1: `ResponsiveImage` (Server Component)

- **Location**: `components/ResponsiveImage.js`
- **Use when**: Displaying a static image with no interactivity
- **Features**: LQIP blur placeholder, crop/hotspot support, responsive `sizes`, lazy/priority loading, captions
- **Required props**: `image` (Sanity image object with `asset._ref`)
- **Key behavior**: Returns `null` if `!image?.asset?._ref` — always safe to render

### Tier 2: `InteractiveImage` (Client Component — `'use client'`)

- **Location**: `components/InteractiveImage.js`
- **Use when**: Image needs lightbox or click-to-navigate behavior
- **Wraps**: `ResponsiveImage` internally — passes all props through
- **Extra props**: `lightboxIdentifier` (opens lightbox), `navigationSlug` + `navigationDocType` (adds navigation button)
- **Requires**: `LightboxContext` from `contexts/LightboxContext.js`

### Tier 3: Next.js `<Image>` — **Never use directly**

- All image rendering goes through `ResponsiveImage` → `urlForImage()` → Sanity CDN
- Direct `<Image>` use bypasses LQIP, crop/hotspot, and Sanity URL building

## Decision Tree

```
Need an image?
├── Static display only → ResponsiveImage
├── Lightbox or click behavior → InteractiveImage
└── Raw Next.js <Image> → ❌ Never
```

## GROQ Image Requirements

Every image field in a GROQ query **must** include LQIP and palette metadata. Use fragment functions from `sanity/lib/queryFragments.js`:

### `imageFields(fieldName, includeKey?)`

Full image object with crop, hotspot, asset ref, palette, and LQIP:

```groq
imageFields('mainImage')
// Produces:
// mainImage {
//   _type, alt, caption,
//   asset { _ref, _type },
//   crop { ... }, hotspot { ... },
//   "palette": asset->metadata.palette,
//   "lqip": asset->metadata.lqip,
// }
```

### `figureFields(includeKey?)`

For Portable Text figure blocks — includes caption position, link, image position/width.

### `mainImageFields(fieldName)`

For document main images — includes all standard fields.

### Inline GROQ pattern (when fragments don't fit)

```groq
"palette": asset->metadata.palette,
"lqip": asset->metadata.lqip,
```

## Component Props Reference

### ResponsiveImage

| Prop               | Type          | Default        | Description                              |
| ------------------ | ------------- | -------------- | ---------------------------------------- |
| `image`            | object        | required       | Sanity image object with `asset._ref`    |
| `alt`              | string        | image.alt      | Override alt text                        |
| `caption`          | string        | image.caption  | Override caption                         |
| `captionStyle`     | string        | `'below'`      | `'below'`, `'insetLeft'`, `'insetRight'` |
| `showCaption`      | bool          | `true`         | Show/hide caption                        |
| `width`            | string/number | `1600`         | Image width                              |
| `height`           | string/number | `width * 0.75` | Image height                             |
| `quality`          | number        | `90`           | JPEG quality                             |
| `sizes`            | string        | —              | Responsive sizes attribute               |
| `priority`         | bool          | —              | Eager load (above fold)                  |
| `loading`          | string        | —              | `'lazy'` or `'eager'`                    |
| `className`        | string        | `''`           | CSS class for `<img>`                    |
| `figureClassName`  | string        | `''`           | CSS class for `<figure>`                 |
| `wrapperClassName` | string        | `''`           | CSS class for outer wrapper              |

### InteractiveImage

All `ResponsiveImage` props, plus:
| Prop | Type | Description |
|------|------|-------------|
| `lightboxIdentifier` | string | Gallery group ID for lightbox |
| `navigationSlug` | string | Slug for click-to-navigate |
| `navigationDocType` | string | Document type for URL building |

## CSS Patterns

Image styles live in `styles/components/`. Key patterns:

- Use `object-fit: cover` with `aspect-ratio` for consistent sizing
- LQIP blur comes from Next.js `blurDataURL` prop (handled automatically by `ResponsiveImage`)
- Caption styles use `.inset-left`, `.inset-right`, `.below` classes

## Checklist

- [ ] Image query includes `lqip` and `palette` metadata (or uses `imageFields()` / `figureFields()`)
- [ ] Using `ResponsiveImage` or `InteractiveImage` (never raw `<Image>`)
- [ ] `alt` text is descriptive (not filename, not empty unless decorative)
- [ ] `sizes` attribute set for responsive layouts
- [ ] `priority` set for largest contentful paint images
- [ ] `stegaClean()` used on any image-derived values used in class names or data attributes
