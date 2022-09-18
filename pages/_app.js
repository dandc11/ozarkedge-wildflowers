import '../styles/globals.css';
import 'the-new-css-reset/css/reset.css';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
    return (
        <Layout test={'some words'}>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
