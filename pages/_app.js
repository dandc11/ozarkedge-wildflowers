import "../styles/globals.css";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <Layout test={"some words"}>
      <h2>Hello</h2>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
