import '../styles/global.css'
import { Playfair_Display, Raleway } from 'next/font/google'
import { VisualEditing } from 'next-sanity'
import { draftMode } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'

import { SanityLive } from '../sanity/lib/sanity.live'
import { DisableDraftMode } from '../components/DisableDraftMode'
import ContextProviders from '../components/ContextProviders'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { GET_MENU_ITEMS_QUERY } from '../sanity/lib/queries'
import { getCurrentSeason } from '../utilities/helperUtil'
import { sanityFetch } from '../sanity/lib/sanity.live'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair-display',
  preload: true,
})

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-raleway',
  preload: true,
})

export default async function RootLayout({ children }) {
  // Fetch the menu data from Sanity
  const menuData = await sanityFetch({
    query: GET_MENU_ITEMS_QUERY,
  })
  const currentSeason = getCurrentSeason()

  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${raleway.variable}`}>
      <body className={`oe-site-body ${currentSeason.SEASON_NAME}`}>
        <SanityLive />
        <ContextProviders>
          <Nav menuData={menuData?.data} />
          <main id={`page-content`} className={`relative`}>
            {children}
          </main>
          <Footer />
          {isDraftMode && (
            <>
              <DisableDraftMode />
              <VisualEditing />
            </>
          )}
          <Analytics />
        </ContextProviders>
      </body>
    </html>
  )
}

// Next.js Metadata API for app router
export const metadata = {
  title: 'Ozarkedge Wildflowers',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.manifest',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}
