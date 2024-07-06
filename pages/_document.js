// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html className='scroll-smooth'>
            <Head>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body className={`oe-site-body`}>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
