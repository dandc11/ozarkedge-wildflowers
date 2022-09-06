import '../styles/global.scss';
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
