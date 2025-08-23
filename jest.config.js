const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',

  // Handle CSS and static file imports
  moduleNameMapper: {
    // Handle CSS imports (project uses native CSS with PostCSS)
    '^.+\\.(css|sass|scss)$': '<rootDir>/tests/mocks/styleMock.js',

    // Handle image imports
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/tests/mocks/fileMock.js',

    // Handle module aliases
    '^@/(.*)$': '<rootDir>/$1',
  }, // Coverage configuration
  collectCoverageFrom: [
    'components/**/*.{js,jsx}',
    'app/**/*.{js,jsx}',
    'utilities/**/*.{js,jsx}',
    'contexts/**/*.{js,jsx}',
    'hooks/**/*.{js,jsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    // Exclude Sanity studio and build files
    '!**/studio/**',
    '!**/sanity/**',
    '!**/schemas/**',
  ],

  // Test file patterns (now includes co-located tests)
  testMatch: ['**/tests/**/*.{js,jsx,ts,tsx}', '**/*.{test,spec}.{js,jsx,ts,tsx}'],

  // Setup files
  setupFiles: ['<rootDir>/jest.env.js'],

  // Test timeout for async operations
  testTimeout: 10000,

  // Ignore non-test helpers and utilities
  testPathIgnorePatterns: ['/node_modules/', '/tests/utils/', '/tests/mocks/'],

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
