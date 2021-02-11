import axios from "axios";
import { useContext, useState } from "react";
import { API } from "../../config";
import Link from "next/link";
import Head from "next/head";
import { addToCart } from "../../components/context/actions";
import { ProductContext } from "../../components/context/globalstate";

const Item = (props) => {
  const [product] = useState(props.product);

  const {
    name,
    images,
    price,
    description,
    companyName,
    companyCountry,
    bodyLocation,
    companyCity,
    sold,
  } = product;

  const [tab, setTab] = useState(0);
  const { state, dispatch } = useContext(ProductContext);
  const { cart } = state;

  const isActive = (index) => {
    if (tab === index) return " active";
    return "";
  };

  return (
    <>
      <div>
        <Head>
          <title>Store Detail</title>
        </Head>
      </div>
      <div className="container py-5 bg-white">
        <div className="row">
          <div className="col-10 mx-auto text-center my-5">
            <h1 className="text-uppercase">{name}</h1>
            <h3 className="text-title text-uppercase lead">
              Sold: <span className="text-danger">{sold}</span>
            </h3>
          </div>
        </div>
        {/* Product Image */}
        <div className="row">
          <div className="col-md-6">
            <img
              src={images[tab]}
              className="d-block img-thumbnail rounded mt-4 w-100"
              alt={images[tab]}
            />
            <div className="row mx-0" style={{ cursor: "pointer" }}>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={img}
                  className={`img-thumbnail rounded ${isActive(index)}`}
                  style={{ height: "80px", width: "20%" }}
                  onClick={() => setTab(index)}
                />
              ))}
            </div>
          </div>
          {/* Product Text */}
          <div className="col-md-6 mt-3">
            <h3 className="text-capitalize font-weight-bold">
              Manufacturer Detail:
            </h3>
            <hr />
            <h4 className="text-title text-muted mb-3 lead">
              Made by:{" "}
              <span className="text-uppercase text-primary">{companyName}</span>
            </h4>
            <h4 className="text-title text-muted mb-5 lead">
              Made in:{" "}
              <span className="text-uppercase text-primary">
                {companyCity}, {companyCountry}
              </span>
            </h4>
            <h4 className="text-capitalize font-weight-bold">Price</h4>
            <hr />
            <h3 className="text-blue mb-5 text-uppercase">
              <strong>
                <span>$</span>
                {price}
              </strong>
            </h3>
            <h3 className="text-capitalize font-weight-bold">
              some info about the product:
            </h3>
            <hr />
            <h4 className="text-title text-muted lead mb-3">
              Location: <span className="text-danger">{bodyLocation}</span>
            </h4>
            <h4 className="text-title text-muted lead">
              Description: <span className="text-danger">{description}</span>
            </h4>
            <div className="col-md-12 mt-5">
              <Link href={`/store`}>
                <span className="pr-3">
                  <button className="btn btn-warning">Back to Products</button>
                </span>
              </Link>
              <button
                className="btn btn-dark mr-3"
                onClick={() => dispatch(addToCart(product, cart))}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
// Use getInitalProps to get the cookie information and token
// Item.getInitialProps = async ({ req, token, query }) => {
//   const response = await axios.get(`${API}/store/${query.id}`);

//   //   Item in response now
//   return { product: response.data, token };
// };

export async function getServerSideProps({ query: { id } }) {
  const { data: product } = await axios.get(`${API}/store/${id}`);
  return {
    props: {
      product,
    },
  };
}
export default Item;
