---
name: testing
description: Detailed testing methodology for writing and fixing Jest + React Testing Library tests in this Next.js + Sanity project. Use when writing new tests, fixing failing tests, or establishing test patterns. Includes mock data workflows, component test checklists, integration test patterns, and example code.
---

# Testing Methodology

This skill provides the detailed methodology for writing tests in the ozarkedge-wildflowers project using Jest and React Testing Library.

## When to Use This Skill

- Writing new component, utility, hook, or integration tests
- Fixing failing tests or diagnosing test issues
- Establishing test patterns for new component types
- Working with Sanity mock data in tests

## Project Test Infrastructure

- **Test runner**: Jest 29 with jsdom environment
- **Component testing**: @testing-library/react 16
- **Shared render helpers**: [tests/utils/test-utils.js](../../../tests/utils/test-utils.js) — `render`, `renderWithoutProviders`
- **Mock data**: [tests/mocks/sanity-mocks.js](../../../tests/mocks/sanity-mocks.js) — `createMockSanityImage`, mock documents
- **Jest config**: [jest.config.js](../../../jest.config.js), [jest.setup.js](../../../jest.setup.js), [jest.env.js](../../../jest.env.js)

## Sanity Mock Data Workflow

Follow these steps **before** creating or modifying mock objects to prevent drift between mock data and real Sanity documents.

### Step 1: Reuse First

Check `tests/mocks/sanity-mocks.js` for existing mocks (plant, season, landing, about, portable text variants, image collections, figures, video blocks). If close, extend locally: `{ ...existingMock, newField }`.

### Step 2: Verify Source of Truth

- Inspect the relevant GROQ query in `sanity/lib/queries.js` to see projected fields.
- Cross-reference schema in `schemas/documents/` and `schemas/objects/` for field names, nesting, types.
- Include only fields: (a) accessed by code under test, or (b) required by invoked helpers.

### Step 3: Minimal Shape

- Keep mocks lean — omit unused arrays, rich text, nested objects.
- Arrays: 1–2 items usually suffice; third only when order matters.
- Images: include `asset._ref`, `alt`, and `lqip`/`palette` when needed. Use format: `image-<hash>-<dimensions>-jpg`.

### Step 4: Portable Text Blocks

- Use existing exported portable text mocks (basic, with video, with image collection, figure).
- Mocks must be arrays of blocks. Never nest block nodes inside block children (prevents invalid `<p>` nesting).
- Mirror schema's `_type`, `_key`, `children`, `markDefs`, `style`.

### Step 5: Error & Edge Scenarios

- Consistent scenario keys: `plants`, `single-plant`, `seasons`, `empty`, `error`, `loading`.
- Error paths: `mockRejectedValue(new Error('...'))`.

### Step 6: Adding New Mock Exports

Add to `sanity-mocks.js` only if: 2+ files use it, reduces >10 lines duplication, or captures reusable complex edge case. Add descriptive comment. Don't remove existing mocks without auditing dependents.

### Step 7: Updating Existing Mocks

Clone, don't mutate: `{ ...mockObj, newField }`. Annotate structural changes with date: `// Updated to match schema change (2026-03)`.

## Unit vs Integration Tests

- **Unit**: Pure functions, isolated component logic without context.
- **Integration**: Multi-component behavior (e.g., `LightboxGallery` + context + `InteractiveImage`). Prefer integration when mocking would recreate real composition.
- Skip trivial presentational markup. Focus on state transitions, conditional rendering, accessibility, interactions.

## Context & State Testing

- For context-driven components, use real providers + state transitions over stubbing hook return values.
- Capture mock calls or inspect updated context values via controlled provider.
- Wrap direct state-updating callbacks in `act()`.

## Example Pattern

```js
/** @jest-environment jsdom */
import { render, screen, fireEvent } from '../tests/utils/test-utils'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders heading with accessible name', () => {
    render(<MyComponent title="Purple Coneflower" />)
    expect(screen.getByRole('heading', { name: /purple coneflower/i })).toBeInTheDocument()
  })

  it('toggles expanded state on click', () => {
    render(<MyComponent />)
    const btn = screen.getByRole('button', { name: /expand/i })
    fireEvent.click(btn)
    expect(screen.getByRole('region', { name: /details/i })).toBeInTheDocument()
  })

  it('handles missing optional prop gracefully', () => {
    render(<MyComponent optionalValue={null} />)
    expect(screen.queryByText(/optional label/i)).not.toBeInTheDocument()
  })
})
```

## Mock Data Quick Checklist

- [ ] Searched `sanity-mocks.js` — no suitable existing mock fits
- [ ] Verified required fields via query + schema
- [ ] Limited to fields actually consumed
- [ ] Included image metadata if needed (alt, asset.\_ref, lqip/palette)
- [ ] Named export clearly and documented purpose
- [ ] Added/updated tests for new structure

## Do & Avoid

**Do**: Use role/text/alt-based queries first. Mock only boundaries. Test observable behavior. Cover edge cases. Keep mocks minimal.

**Avoid**: Overusing `data-testid`. Snapshotting entire DOM trees. Asserting private internals. Depending on CSS class names for non-semantic assertions.
