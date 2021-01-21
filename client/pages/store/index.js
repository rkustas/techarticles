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
      <Title name="all" title="products"></Title>
      <section className="productslist">
        <div className="productslist-center">
          {" "}
          {products.length ? (
            products.map((product) => (
              <Product key={product._id} product={product} />
            ))
          ) : (
            <Title name="non" title="products"></Title>
          )}
        </div>
      </section>
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
