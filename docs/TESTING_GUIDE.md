# Testing Guide

This project uses Jest and React Testing Library for unit and integration tests.

## Quick start

- Run all tests: `npm test`
- Watch mode: `npm run test:watch`

## General guidelines

- Validate behavior, not implementation details.
- Prefer accessibility-first queries: getByRole, getByText, getByLabelText, getByAltText.
- Mock boundaries only (Next.js modules, Sanity client, external libs).
- Keep tests deterministic; avoid real network and Sanity calls.

## Portable Text mocks (Sanity)

When mocking Portable Text content for components that use `@portabletext/react`:

- Provide value as an array of blocks/objects, not a single nested object.
- Do not nest block objects inside another block's `children`. A block's children should be `span` nodes.
- Example of a valid minimal block:

```js
const value = [
  {
    _key: 'k1',
    _type: 'block',
    style: 'normal',
    children: [{ _key: 's1', _type: 'span', marks: [], text: 'Hello world' }],
    markDefs: [],
  },
]
```

Following these rules avoids invalid DOM like nested `<p>` that trigger React warnings in tests.

Rules summary:

- Value is an array: `[block, block, customType, ...]`
- A `block` has `children` of `span` nodes only (no nested `block` inside a `block`)
- Custom types (e.g., `figure`, `imageCollection`, `portTextVideo`, `teaserSection`) are peers in the array, not nested in a block's `children`

## act() usage

- Wrap direct invocations of callbacks that trigger React state updates with `act` to avoid warnings.
- Examples:

```js
import { act } from '@testing-library/react'

act(() => {
  onClose()
})

// Clicking a mock element that triggers a stateful callback
act(() => {
  fireEvent.click(screen.getByTestId('close-btn'))
})
```

## Useful tips

- Use the shared test utilities under `tests/utils/test-utils` for consistent providers and setup.
- Prefer `render` over custom mounts unless verifying provider-less behavior.
- Reset mocks in `beforeEach` when needed to keep tests isolated.
