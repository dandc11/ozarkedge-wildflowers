---
name: 'Testing Conventions'
description: 'Jest and React Testing Library conventions for component, utility, and integration tests'
applyTo: '**/*.test.js,**/*.integration.test.js'
---

# Testing Conventions (Jest & React Testing Library)

## File Conventions

- Unit tests: `Component.test.js` — co-located in `components/` or `utilities/`.
- Integration tests: `Something.integration.test.js` — for multi-component interactions.
- Use `@jest-environment jsdom` for component tests; `@jest-environment node` for pure utilities.
- Group with nested `describe` blocks: 'Basic Rendering', 'Accessibility', 'Interaction', 'Error Handling'.

## Query Priority

1. `getByRole` (with `name`) for interactive/semantic elements
2. `getByLabelText`, `getByText`, `getByAltText` for content
3. `getByTestId` only when semantics are impractical
4. `queryBy*` for asserting absence; `findBy*` for async appearance
5. Prefer regex `/case-insensitive/i` over `{ exact: false }`

## Rendering

- Use `render` from `tests/utils/test-utils` (includes providers). Use `renderWithoutProviders` only when explicitly testing no-provider behavior.
- Use mock factories from `tests/mocks/sanity-mocks.js` (e.g. `createMockSanityImage`).

## Mocking

- Mock boundaries, not internals: Next.js modules (`next/navigation`, `next/image`), Sanity image builders, external libraries.
- `jest.mock()` at top-level; `jest.clearAllMocks()` in `beforeEach`.
- Prefer simple return values over complex mock logic. For chained builders, return minimal chainable objects.
- Do not call live Sanity or network services — mock the client/image URL helpers.

## Assertions

- Verify `alt` attributes on all image tests.
- Assert `role` + accessible name for interactive elements, not class names.
- Use `data-testid` sparingly — confirm role/text/label/alt are insufficient first.
- Avoid broad DOM snapshots. Use snapshots only for mock argument shape verification or serialized outputs.
- Do not assert private implementation details or CSS class names (unless class conveys meaningful state).

## Events & Async

- Use `fireEvent` for interactions. Use `waitFor` or `findBy*` after async state changes.
- Use `jest.useFakeTimers()` only for explicit time-based utilities; always restore with `jest.useRealTimers()`.

## Coverage Checklist for New Component Tests

- Renders with minimal valid props
- Accessibility attributes correct (role/alt/label)
- Conditional branches exercised (variants, flags)
- Interactions tested (click/keyboard)
- Error/fallback states covered (missing/invalid props)
- External boundaries mocked (router, Sanity image builder)
- Assertions are implementation-agnostic
