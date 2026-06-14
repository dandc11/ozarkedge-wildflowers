# WCAG AA Accessibility Audit

**Date:** 2026-06-13
**Branch:** `feature/issue-225-full-ozarkedgewildflowers-accessibility`
**Scope:** Full code audit of `components/`, `app/`, and `styles/`

All findings are confirmed against source files. Fixes are being applied on the branch associated with issue #225.

---

## Findings

### 1. NatureServeBadge toggle is not keyboard accessible
**WCAG:** 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value) — **High**
**File:** `components/NatureServeBadge.js:40`

`<div onClick={toggleIsExpanded}>` is not reachable by keyboard and has no semantic role or accessible name.

**Fix:** Replace with `<button>`, add `aria-expanded={isExpanded}` and `aria-label`.

---

### 2. Heading circle (ToC toggle) is not keyboard accessible
**WCAG:** 2.1.1, 4.1.2 — **High**
**File:** `components/Heading.js:137`

`<div className={circleClassName} onClick={toggleTableOfContents}>` has no role, no accessible name, and is not keyboard reachable.

**Fix:** Replace with `<button>`, add `aria-expanded={tableOfContentsOpen}` and `aria-label="Toggle table of contents"`.

---

### 3. Decorative SVG icons missing aria-hidden
**WCAG:** 1.1.1, 4.1.2 — **Medium**
**Files:** `components/IconInfo.js:7`, `components/Button.js` (all 6 icon components)

All SVG icons are decorative but lack `aria-hidden="true"`, causing screen readers to announce them. Additionally, `ChevronUp` (line 68), `ChevronRight` (line 85), and `ChevronLeft` (line 102) use `(strokeWidth = 1)` instead of `({ strokeWidth = 1 })`, breaking prop destructuring.

**Fix:** Add `aria-hidden="true"` to all SVGs. Fix destructuring on the three broken icon components.

---

### 4. Nav hamburger label doesn't reflect open/closed state
**WCAG:** 4.1.2 (Name, Role, Value) — **Low**
**File:** `components/Nav.js:54`

`aria-label="Open the main menu"` is static — it never updates when the menu is open.

**Fix:** `aria-label={isMenuOpen ? 'Close the main menu' : 'Open the main menu'}` + `aria-expanded={isMenuOpen}`.

---

### 5. Nav background images missing empty alt text
**WCAG:** 1.1.1 (Non-text Content) — **Medium**
**File:** `components/Nav.js:80, 91`

Two `<ResponsiveImage>` components used as pure decorative backgrounds have no explicit `alt=""`. If Sanity data has no alt text, the image is announced without an accessible name.

**Fix:** Pass `alt=""` explicitly on both nav background images.

---

### 6. Missing skip navigation link
**WCAG:** 2.4.1 (Bypass Blocks) — **Medium**
**File:** `app/layout.js`

No skip link exists to bypass the navigation. `<main id="page-content">` is already in place as a target.

**Fix:** Add `<a href="#page-content" className="skip-link">Skip to main content</a>` as the first element in `<body>`. Style `.skip-link` visually hidden until focused.

---

### 7. Missing :focus-visible styles on interactive elements
**WCAG:** 2.4.7 (Focus Visible) — **High**
**Files:** `styles/base.css:90`, `styles/components/nav.css:98–106`, `styles/components/tableofcontents.css`, `styles/components/button.css`

`a[href]` in `base.css` removes `text-decoration` with no focus replacement. Nav links and ToC links only have `:hover` states. Buttons have no `:focus-visible` state at all.

**Fix:** Add a global `:focus-visible` rule in `base.css`. Add component-level `:focus-visible` to nav links, ToC links, and buttons.

---

### 8. Animations missing prefers-reduced-motion
**WCAG:** 2.3.3 (Animation from Interactions) — **Medium**
**Files:** `styles/base.css:197`, `styles/components/nav.css:29–58, 141`

`fadeIn` keyframe animation and nav item stagger animations run unconditionally with no `prefers-reduced-motion` fallback.

**Fix:** Add to `base.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 9. PlantName botanical heading creates h1 → h3 skip
**WCAG:** 1.3.1 (Info and Relationships) — **Medium**
**File:** `components/PlantName.js:43`

Botanical name is always rendered as `<h3>`. On plant detail pages where `headingLevel=1`, this creates a heading order of h1 → h3, skipping h2.

**Fix:** Render botanical name as `headingLevel + 1` (capped at 6).

---

### 10. External link missing new-window indicator
**WCAG:** 2.4.4 (Link Purpose in Context) — **Low**
**File:** `components/NatureServeMessage.js`

External link uses `target="_blank"` with no visual or textual indication it opens in a new tab. `rel="noopener noreferrer"` also needs to be confirmed.

**Fix:** Add visually-hidden text `(opens in new window)` or an `aria-label`. Ensure `rel="noopener noreferrer"` is present.

---

### 11. Color contrast: light yellow and teal palette needs audit
**WCAG:** 1.4.3 (Contrast Minimum), 1.4.11 (Non-text Contrast) — **High (needs verification)**
**File:** `styles/colors.css`

`--oe-yellow-400` (hsl 60, 100%, 58%) and `--oe-blue-green-light-500` (hsl 168, 25%, 66%) may fail contrast requirements when used as text or UI colors. Cannot confirm from CSS alone — requires runtime measurement.

**Fix:** Run axe or Lighthouse against the dev/production site to identify failing color pairs, then adjust values in `colors.css`. May require design input.

---

## Status

| # | Finding | WCAG | Severity | Status |
|---|---------|------|----------|--------|
| 1 | NatureServeBadge not keyboard accessible | 2.1.1, 4.1.2 | High | ⬜ To do |
| 2 | Heading ToC toggle not keyboard accessible | 2.1.1, 4.1.2 | High | ⬜ To do |
| 3 | SVG icons missing aria-hidden | 1.1.1, 4.1.2 | Medium | ⬜ To do |
| 4 | Hamburger label doesn't reflect state | 4.1.2 | Low | ⬜ To do |
| 5 | Nav images missing alt="" | 1.1.1 | Medium | ⬜ To do |
| 6 | Missing skip navigation link | 2.4.1 | Medium | ⬜ To do |
| 7 | Missing :focus-visible styles | 2.4.7 | High | ⬜ To do |
| 8 | Animations missing prefers-reduced-motion | 2.3.3 | Medium | ⬜ To do |
| 9 | PlantName h1→h3 heading skip | 1.3.1 | Medium | ⬜ To do |
| 10 | External link missing new-window indicator | 2.4.4 | Low | ⬜ To do |
| 11 | Color contrast audit (light yellow/teal) | 1.4.3, 1.4.11 | High | ⬜ Needs runtime audit |
