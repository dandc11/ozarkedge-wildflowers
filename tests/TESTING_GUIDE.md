# Testing Guide for Ozarkedge Wildflowers

## Overview

This project uses Jest 29 and React Testing Library for testing a Next.js 14 application. The tests are organized into unit tests for individual components and integration tests for verifying interactions between components. The project also utilizes Sanity.io as a CMS and PostCSS for styling.

## Running Tests

To run the tests in the project, you can use the following npm scripts:

- **Run all tests:**

  ```bash
  npm test
  ```

- **Run unit tests only:**

  ```bash
  npm run test:unit
  ```

- **Run integration tests only:**

  ```bash
  npm run test:integration
  ```

- **Run tests in watch mode:**

  ```bash
  npm run test:watch
  ```

- **Run tests with coverage report:**
  ```bash
  npm run test:coverage
  ```

## Test Structure

The tests are organized into two main directories:

- **tests/unit/**: Contains unit tests for individual components and utilities.
- **tests/integration/**: Contains integration tests that verify the interaction between multiple components.

## Writing Tests

When writing tests, follow these guidelines:

- Use Jest for the testing framework and React Testing Library for rendering components.
- Ensure that each test is isolated and does not depend on the state of other tests.
- Use mocks for external dependencies to keep tests focused on the component logic.
- Write descriptive test names that clearly state what is being tested.
- Prefer semantic queries (e.g., `getByRole`, `getByLabelText`) over test IDs for better accessibility.

## Example Test

Here’s an example of an integration test for the `PlantImageCard` component:

```javascript
import { render, screen } from '../utils/test-utils'
import PlantImageCard from '../../components/PlantImageCard'

describe('PlantImageCard Integration', () => {
  it('renders plant name, months, and habitat', () => {
    render(
      <PlantImageCard
        plantName={{ commonName: 'Wild Bergamot', botanicalName: 'Monarda fistulosa' }}
        titleText="Wild Bergamot"
        image={{
          _type: 'image',
          asset: { _ref: 'image-mock-ref-123', _type: 'reference' },
          alt: 'Wild Bergamot',
        }}
        floweringMonths={[5, 6, 7]}
        habitatType={['Prairie', 'Savanna']}
      />,
    )
    expect(screen.getByText('Wild Bergamot')).toBeInTheDocument()
    // Additional assertions...
  })
})
```

## Best Practices

- Keep tests fast and reliable by avoiding unnecessary complexity.
- Regularly run tests during development to catch issues early.
- Use the `--watch` flag with Jest to automatically rerun tests on file changes.
- Mock external dependencies to isolate component behavior.
- Use clear and descriptive names for test cases to improve readability.
- Ensure tests cover both happy paths and edge cases.
- Follow the Sanity and Next.js guidelines for data fetching and component structure.

## Conclusion

Following these guidelines will help maintain a robust testing strategy for the Ozarkedge Wildflowers project.
