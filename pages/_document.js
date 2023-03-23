// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="..." />
            </Head>
            <body className={`text-gray-800`}>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
