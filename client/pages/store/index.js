import Layout from "../../components/layout";
import axios from "axios";
import { API } from "../../config";
import Title from "../../components/title";
import Product from "../../components/products";
import Head from "next/head";
const Store = ({ products }) => {
  // console.log(products);
  return (
    <Layout>
      <div>
        <Head>
          <title>Store</title>
        </Head>
      </div>
      {products.length ? (
        <>
          <Title name="all" title="products"></Title>
          <section className="productslist">
            <div className="productslist-center">
              {" "}
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <Title name="No" title="products"></Title>
      )}
    </Layout>
  );
};

export async function getStaticProps() {
  const { data: products } = await axios.get(`${API}/store/products`);
  return {
    props: {
      products,
    },
  };
}

export default Store;
