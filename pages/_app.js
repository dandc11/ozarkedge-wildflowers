import './../styles/global.css';
import { Playfair_Display, Raleway } from '@next/font/google';
import Layout from '../components/Layout';
import Head from 'next/head';

const PLAYFAIR_DISPLAY = Playfair_Display({
    variable: '--font-playfair-display',
    style: ['normal', 'italic'],
    subsets: ['latin'],
});

const RALEWAY = Raleway({
    variable: '--font-raleway',
    style: ['normal', 'italic'],
    subsets: ['latin'],
});

function OzarkedgeApp({ Component, pageProps }) {
    return (
        <div className={`${PLAYFAIR_DISPLAY.variable} ${RALEWAY.variable}`}>
            <Head>
                <title>Ozarkedge Wildflowers</title>
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </div>
    );
}

export default OzarkedgeApp;
