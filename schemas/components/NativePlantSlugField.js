// /components/NativePlantSlugField.jsx
import {useEffect} from 'react'
import {Stack, Text, TextInput} from '@sanity/ui'
import {set} from 'sanity'

export const NativePlantSlugField = (props) => {
  const {elementProps, onChange, value = ''} = props
  const commonName = props.document.plantName.commonName;
  const botanicalName = props.document.plantName.botanicalName;
  const slugValue = `${commonName}-${botanicalName}`.toLowerCase().replace(/\s+/g, '-').slice(0, 200);

  useEffect(() => {
    onChange(set(slugValue));
  }, [commonName, botanicalName,slugValue, onChange]);

  return (
    <Stack space={2}>
      <TextInput
        {...elementProps}
        readOnly
        value={slugValue}
      />
      <Text>Characters: {slugValue.length}</Text>
    </Stack>
  )
}