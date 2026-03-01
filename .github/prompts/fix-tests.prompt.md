---
description: 'Run failing tests, diagnose issues, and fix them'
agent: agent
tools:
  - search/codebase
  - edit/editFiles
  - read/terminalLastCommand
  - execute/getTerminalOutput
  - vscode/runTests
---

# Fix Tests

Diagnose and fix failing tests.

## Instructions

Follow the project's testing conventions defined in:

- [Testing instructions](../instructions/testing.instructions.md)
- [Test mock data guidelines](../instructions/test-mocks.instructions.md)

## Steps

1. Run the failing test(s) to capture the exact error output.
2. Read both the test file and the source file it tests.
3. Diagnose the failure — common causes:
   - Mock data shape doesn't match current GROQ query/schema
   - Missing mock for a new dependency
   - Component behavior changed but test wasn't updated
   - Async state not properly awaited
4. Fix the test (or source if appropriate). Prefer updating the test over adding `data-testid` to source.
5. Re-run the test to confirm it passes.
6. Run the full test suite to check for regressions.
