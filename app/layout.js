import '../styles/global.css'
import { Playfair_Display, Raleway } from 'next/font/google'
import { VisualEditing } from 'next-sanity/visual-editing'
import { draftMode } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'

import { SanityLive } from '../sanity/lib/sanity.live'
import { DisableDraftMode } from '../components/DisableDraftMode'
import ContextProviders from '../components/ContextProviders'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { GET_MENU_ITEMS_QUERY, GET_SITE_SETTINGS_QUERY } from '../sanity/lib/queries'
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
  const { isEnabled: isDraftMode } = await draftMode()
  // Fetch the menu data from Sanity with proper perspective/stega
  const menuData = await sanityFetch({
    query: GET_MENU_ITEMS_QUERY,
    perspective: isDraftMode ? 'drafts' : 'published',
    stega: isDraftMode,
  })
  const currentSeason = getCurrentSeason()
  const isProd = process.env.NODE_ENV === 'production'
  const shouldMountSanityLive = isProd || isDraftMode

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${raleway.variable}`}>
      <body className={`oe-site-body ${currentSeason.SEASON_NAME}`}>
        {shouldMountSanityLive && <SanityLive />}
        <ContextProviders>
          <a href="#page-content" className="skip-link">Skip to main content</a>
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
export async function generateMetadata() {
  const { data: siteSettings } = await sanityFetch({
    query: GET_SITE_SETTINGS_QUERY,
    perspective: 'published',
    stega: false,
  })

  return {
    metadataBase: new URL('https://ozarkedgewildflowers.com'),
    title: {
      default: 'Ozarkedge Wildflowers | Native Plants of Arkansas',
      template: '%s | Ozarkedge Wildflowers',
    },
    description:
      siteSettings?.description ||
      'Discover native wildflowers of the Arkansas Ozarks — seasonal guides, plant profiles, and field photography from Ozarkedge.',
    keywords: siteSettings?.keywords ?? undefined,
    openGraph: {
      siteName: 'Ozarkedge Wildflowers',
      locale: 'en_US',
      type: 'website',
    },
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
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}
