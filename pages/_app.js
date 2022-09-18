import '../styles/global.scss';
import 'the-new-css-reset/css/reset.css';
import Layout from '../components/Layout';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Sanity site settings should set these values!</title>
            </Head>
            <Layout test={'some words'}>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}

export default MyApp;
