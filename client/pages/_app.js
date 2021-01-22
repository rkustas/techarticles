import Layout from "../components/layout";
import { ProductProvider } from "../components/context/globalstate";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ProductProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ProductProvider>
  );
}

export default MyApp;
