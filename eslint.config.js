const nextCoreWebVitals = require('eslint-config-next/core-web-vitals')
const prettier = require('eslint-config-prettier')

/**
 * ESLint 9 flat config.
 *
 * Replaces the legacy `.eslintrc.json` + the `--ignore-path .gitignore` CLI flag
 * (both unsupported by ESLint 9, which is pulled in by eslint-config-next 16 and
 * made `npm run lint` error out entirely). `eslint-config-next/core-web-vitals`
 * is a native flat config that already bundles the react, react-hooks, import,
 * jsx-a11y and @next/next plugins; `eslint-config-prettier` (applied last)
 * disables stylistic rules that would conflict with Prettier.
 *
 * Lint is advisory: it runs only via `npm run lint` (not in CI or `next build`),
 * and every project rule below is a warning, never an error.
 *
 * @type {import('eslint').Linter.Config[]}
 */
module.exports = [
  {
    // Build output, generated files and non-source dirs (formerly via .gitignore).
    ignores: [
      // Full checkouts of other branches, one per parallel session. Linting them
      // reports another branch's warnings as this one's. Same reason jest.config.js
      // excludes them from test collection.
      '.claude/worktrees/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      '.sanity/**',
      '.swc/**',
      'next.lock/**',
      'public/**',
      'backups/**',
      'next-env.d.ts',
    ],
  },
  ...nextCoreWebVitals,
  {
    linterOptions: {
      // The codebase keeps a few intentional inline eslint-disable comments; don't
      // nag about ones rendered redundant by the rule settings below.
      reportUnusedDisableDirectives: 'off',
    },
    rules: {
      'import/order': ['warn', { 'newlines-between': 'always' }],
      'react/display-name': 'off',
      // This project standardizes on the <ResponsiveImage>/<InteractiveImage>
      // wrappers and forbids next/image directly (see CLAUDE.md), so the
      // no-img-element hint (which recommends next/image) does not apply.
      '@next/next/no-img-element': 'off',
      // Newer react-hooks (React Compiler) rules that the codebase predates.
      // Kept as advisory warnings rather than hard errors — they flag
      // real-but-stylistic patterns and partly false-positive on legit
      // client-detection effects.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
    },
  },
  prettier,
]
