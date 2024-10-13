'use client'
import { LiveQueryProvider } from 'next-sanity/preview'

import { client } from '../app/lib/sanity.client'

export default function PreviewProvider({ children, token }) {
  if (!token) throw new TypeError('Missing token')
  return (
    <LiveQueryProvider client={client} token={token} logger={console}>
      {children}
    </LiveQueryProvider>
  )
}
