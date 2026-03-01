---
name: 'JavaScript Conventions'
description: 'JavaScript utility functions, naming, JSDoc, error handling, and async patterns'
---

# JavaScript Conventions

These apply to utility files in `/utilities/` and general JS throughout the project.

## Naming

- camelCase for functions/variables, PascalCase for components, UPPER_SNAKE_CASE for constants.
- Utility files go in `/utilities/` (e.g., `helperUtil.js`, `imageUtil.js`).

## Functions

- Use named exports. Add JSDoc with `@param` and `@returns` for all exported functions.
- Keep functions small and single-responsibility. Use destructuring for parameters.

```js
/**
 * @param {string} slug - The slug to transform
 * @param {object} options - Configuration options
 * @param {boolean} [options.lowercase=true] - Whether to convert to lowercase
 * @returns {string} The transformed slug
 */
```

## Async & Error Handling

- Use async/await. Handle rejections with try/catch.
- Provide fallback values when data might be missing.
- Use informative error messages.

## Constants

- Keep hardcoded values in `/utilities/constants.js`. Organize related constants into objects or Maps.
