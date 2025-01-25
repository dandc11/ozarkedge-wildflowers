// app/api/draft-mode/enable/route.js
import { defineEnableDraftMode } from 'next-sanity/draft-mode'

import { client } from '../../../../sanity/lib/sanity.client'
import { token } from '../../../../sanity/lib/sanity.token'

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
})
