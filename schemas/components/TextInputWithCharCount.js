import {useCallback} from 'react'
import {Stack, Text, TextArea} from '@sanity/ui'
import {set, unset} from 'sanity'

export const TextInputWithCharCount = (props) => {
  const {elementProps, onChange, value = ''} = props

  const handleChange = useCallback((event) => {
    const nextValue = event.currentTarget.value
    onChange(nextValue ? set(nextValue) : unset())
	}, [onChange])

  return (
    <Stack space={2}>
      <TextArea
        {...elementProps}
        onChange={handleChange}
        value={value}
      />
      <Text>Character count: {value.length}</Text>
    </Stack>
  )
}