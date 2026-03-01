---
description: 'Write tests for a component or utility following project testing conventions'
agent: agent
tools:
  - search/codebase
  - edit/createFile
  - edit/editFiles
  - read/terminalLastCommand
  - execute/getTerminalOutput
  - vscode/runTests
---

# Write Tests

Write tests for the specified component or utility file.

## Instructions

Follow the project's testing conventions defined in:

- [Testing instructions](../instructions/testing.instructions.md)
- [Test mock data guidelines](../instructions/test-mocks.instructions.md)

## Steps

1. Read the source file to understand its behavior, props, branches, and edge cases.
2. Check `tests/mocks/sanity-mocks.js` for existing mocks that can be reused.
3. Determine if this needs a unit test or integration test:
   - **Unit**: Pure functions, isolated component logic
   - **Integration**: Components with context, multi-component interactions
4. Create the test file following naming conventions:
   - Unit: `ComponentName.test.js` (co-located with source)
   - Integration: `ComponentName.integration.test.js`
5. Include correct jest-environment pragma (`jsdom` for components, `node` for utilities).
6. Write tests covering: minimal props, accessibility, interactions, error/fallback states.
7. Run the tests to verify they pass.
