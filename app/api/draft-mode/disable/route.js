// app/api/disable-draft/route.ts
// app/api/draft-mode/disable/route.js
import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  ;(await draftMode()).disable()
  return NextResponse.redirect(new URL('/', request.url))
}
