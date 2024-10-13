import '../styles/global.css';
import 'lightbox.js-react/dist/index.css';
import { Playfair_Display, Raleway } from 'next/font/google';
import Head from 'next/head';
import dynamic from 'next/dynamic'
import {draftMode} from 'next/headers'

import {token} from './lib/sanity.fetch'
import ClientProviders from '../components/ClientProviders';  

const PreviewProvider = dynamic(() => import('../components/PreviewProvider'));

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  style: ['normal', 'italic'],
});

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  style: ['normal', 'italic'],
});

export default function RootLayout({ children, pageProps }) {

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${raleway.variable}`}>
      <Head>
      <title>Ozarkedge Wildflowers</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon-192x192.png" sizes="192x192" />
        <link rel="icon" href="/favicon-512x512.png" sizes="512x512" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body className='oe-site-body'>
      {draftMode ? (
        <PreviewProvider token={token}>
          <ClientProviders>
              {children}
          </ClientProviders>
        </PreviewProvider>
      ) : (
        <ClientProviders>
            {children}
        </ClientProviders>
      )}
      </body>
    </html>
  );
}