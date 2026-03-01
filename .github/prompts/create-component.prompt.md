---
description: 'Scaffold a new React component with matching CSS file'
agent: agent
tools:
  - search/codebase
  - edit/createFile
  - edit/editFiles
---

# Create Component

Scaffold a new component following project conventions.

## Instructions

Follow the conventions defined in:

- [Component instructions](../instructions/components.instructions.md)
- [CSS instructions](../instructions/css.instructions.md)

## Steps

1. Create the component file in `components/` as a React Server Component (no `'use client'`). Add `'use client'` only if hooks or browser APIs are needed.
2. Create matching CSS file in `styles/components/{component-name}.css`.
3. Import the CSS file in the component or add it to a page-level import.
4. Use semantic HTML, accessibility attributes, and descriptive class names.
5. For images, use `ResponsiveImage` (static) or `InteractiveImage` (lightbox) — never Next.js `<Image>` directly.
6. Add JSDoc comment at the top describing the component's purpose.
7. Offer to write tests for the new component.
