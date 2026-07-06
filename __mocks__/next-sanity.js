// Manual mock for the ESM-only `next-sanity` package. Jest's CommonJS runtime
// can't parse next-sanity's ESM entry, so importing any component that uses it
// (e.g. createDataAttribute, stegaClean) throws "Cannot use import statement
// outside a module". This mock is applied automatically to every test.
//
// Implementations mirror the shapes the app relies on: stegaClean passes text
// through untouched, createDataAttribute returns an object whose toString()
// yields a stable data-sanity string, and groq concatenates the template.
module.exports = {
  stegaClean: (value) => value,
  createDataAttribute: (config) => ({
    toString: () =>
      config ? `id=${config.id};type=${config.type};path=${config.path}` : '',
  }),
  groq: (strings, ...values) =>
    strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), ''),
}
