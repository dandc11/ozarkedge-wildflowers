import { useCallback, useEffect, useRef } from 'react'
import { TextInput } from '@sanity/ui'
import { set, unset, useClient, useFormValue } from 'sanity'

/**
 * Custom input for the `alt` field on image objects.
 * When an asset is selected and alt is empty, pre-fills from the asset's
 * stored `altText` value (set via the Media Library).
 */
export const AltTextInput = (props) => {
  const { elementProps, onChange, value = '', path } = props
  const client = useClient({ apiVersion: '2024-10-28' })

  // Derive the sibling asset._ref path from this field's path in the document.
  // e.g. ['introPhoto', 'alt'] → ['introPhoto', 'asset', '_ref']
  const assetRefPath = [...path.slice(0, -1), 'asset', '_ref']
  const assetRef = useFormValue(assetRefPath)
  const prevAssetRef = useRef(null)

  useEffect(() => {
    // Skip if no asset selected, or if the same asset is already loaded
    if (!assetRef || assetRef === prevAssetRef.current) return
    prevAssetRef.current = assetRef

    // Don't overwrite alt text the editor has already entered
    if (value) return

    client.fetch(`*[_id == $id][0].altText`, { id: assetRef }).then((altText) => {
      if (altText) onChange(set(altText))
    })
  }, [assetRef, client, onChange, value])

  const handleChange = useCallback(
    (event) => {
      const nextValue = event.currentTarget.value
      onChange(nextValue ? set(nextValue) : unset())
    },
    [onChange],
  )

  return <TextInput {...elementProps} onChange={handleChange} value={value} />
}
