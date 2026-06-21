import { useEffect, useRef } from 'react'
import { set, useClient } from 'sanity'

/**
 * Wraps any image type input to auto-populate the `alt` field from the
 * asset's stored `altText` when an image is first selected.
 * Delegates all rendering to renderDefault — the UI is unchanged.
 */
export const ImageInputWithAltFill = (props) => {
  const { value, onChange, renderDefault } = props
  const client = useClient({ apiVersion: '2024-10-28' })
  const prevAssetRef = useRef(null)
  const assetRef = value?.asset?._ref

  useEffect(() => {
    if (!assetRef || assetRef === prevAssetRef.current) return
    prevAssetRef.current = assetRef
    if (value?.alt) return

    client.fetch(`*[_id == $id][0].altText`, { id: assetRef }).then((altText) => {
      if (altText) onChange(set(altText, ['alt']))
    })
  }, [assetRef, client, onChange, value?.alt])

  return renderDefault(props)
}
