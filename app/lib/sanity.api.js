export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const useCdn = false;

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const readToken = process.env.SANITY_API_READ_TOKEN || 'Preview not set'

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-06-21'

export const previewSecretId = 'preview.secret'

function assertValue(value = undefined, errorMessage) {
  if (value === undefined) {
    throw new Error(errorMessage)
  }

  return value;
}