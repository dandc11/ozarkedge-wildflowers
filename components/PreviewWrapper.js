// PreviewWrapper.tsx

import {Slot} from '@radix-ui/react-slot'
import {PreviewData} from '@/components/PreviewData'

// Component just renders its children if preview mode is not enabled
export function PreviewWrapper(props) {
  const {
    // Is preview mode active?
    preview = false,
    // If so, listen to this query
    query = null,
    // With these params
    params = {},
    // Separate remaining props to pass to the child
    ...rest
  } = props

  // Render child, with the wrapper's initial data and props
  if (!preview || !query) {
    const nonPreviewProps = {...rest, data: props.initialData}

    return <Slot {...nonPreviewProps} />
  }

  // Swap initialData for live data
  return (
    <PreviewData
      initialData={props.initialData}
      query={query}
      params={params}
    >
      {props.children}
    </PreviewData>
  )
}