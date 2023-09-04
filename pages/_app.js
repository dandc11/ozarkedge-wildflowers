import '../styles/global.css'
import 'lightbox.js-react/dist/index.css'
import { Playfair_Display, Raleway } from "next/font/google"
import Layout from '../components/Layout'
import Head from 'next/head'
import { lazy } from 'react'

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
    <div className={`${PLAYFAIR_DISPLAY.variable} ${RALEWAY.variable}`}>
      <Head>
        <title>Ozarkedge Wildflowers</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {draftMode ? (
        <PreviewProvider token={token}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PreviewProvider>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </div>
  )
}

export default OzarkedgeApp
