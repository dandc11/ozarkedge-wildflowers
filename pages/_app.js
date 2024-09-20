import '../styles/global.css'
import 'lightbox.js-react/dist/index.css'
import { Playfair_Display, Raleway } from 'next/font/google'
import Head from 'next/head'
import { lazy } from 'react'

import Layout from '../components/Layout'
import { NavButtonColorProvider } from '../contexts/NavButtonColorContext'

const PLAYFAIR_DISPLAY = Playfair_Display({
  variable: '--font-playfair-display',
  style: ['normal', 'italic'],
  subsets: ['latin'],
})

const RALEWAY = Raleway({
  variable: '--font-raleway',
  style: ['normal', 'italic'],
  subsets: ['latin'],
})

const PreviewProvider = lazy(() => import('../components/PreviewProvider'))

function OzarkedgeApp({ Component, pageProps }) {
  const { draftMode, token } = pageProps
  return (
    <div>
      <Head>
        <title>Ozarkedge Wildflowers</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style jsx global>{`
        :root {
          --font-raleway: ${RALEWAY.style.fontFamily};
          --font-playfair-display: ${PLAYFAIR_DISPLAY.style.fontFamily};
        }
      `}</style>
      {draftMode ? (
        <PreviewProvider token={token}>
          <NavButtonColorProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </NavButtonColorProvider>
        </PreviewProvider>
      ) : (
        <NavButtonColorProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NavButtonColorProvider>
      )}
    </div>
  )
}

export default OzarkedgeApp
