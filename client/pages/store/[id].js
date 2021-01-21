import Layout from "../../components/layout";
import axios from "axios";
import { useContext } from "react";
import { API } from "../../config";
import Link from "next/link";
import { ButtonContainer } from "../../Components/button";
import Head from "next/head";
import { addToCart } from "../../components/context/actions";
import { ProductContext } from "../../components/context/globalstate";

const Item = ({ product, token }) => {
  const {
    Name,
    Image,
    Price,
    CompanyName,
    CompanyCountry,
    Category,
    BodyLocation,
    CompanyCity,
    sold,
  } = product;
  const { state, dispatch } = useContext(ProductContext);
  const { cart } = state;

  return (
    <Layout>
      <div>
        <Head>
          <title>Store Detail</title>
        </Head>
      </div>
      <div className="container py-5 bg-white">
        <div className="row">
          <div className="col-10 mx-auto text-center my-5">
            <h1>{Name}</h1>
            <h3 className="text-title text-uppercase">Sold: {sold}</h3>
          </div>
        </div>
        {/* Product Image */}
        <div className="row">
          <div className="col-10 mx-auto col-md-6 my-3">
            <img src={Image} className="h-100 w-100 p-5" alt={Name} />
          </div>
          {/* Product Text */}
          <div className="col-10 mx-auto col-md-6 my-3 text-capitalize mb-5 align-self-center">
            <h3 className="text-capitalize font-weight-bold">
              Manufacturer Detail:
            </h3>
            <h4 className="text-title text-uppercase text-muted mb-3">
              made by : <span className="text-uppercase">{CompanyName}</span>
            </h4>
            <h4 className="text-title text-uppercase text-muted mb-5">
              made in :{" "}
              <span className="text-uppercase">
                {CompanyCity}, {CompanyCountry}
              </span>
            </h4>
            <h4 className="text-blue mb-5 text-uppercase">
              <strong>
                Price: <span>$</span>
                {Price}
              </strong>
            </h4>
            <h4 className="text-capitalize font-weight-bold">
              some info about the product:
            </h4>
            <h5 className="text-title text-muted lead mb-0">
              Location: {BodyLocation}
            </h5>
            <h5 className="text-title text-muted lead">
              Product Category: {Category}
            </h5>
            <div className="col-md-12 mt-3">
              <Link href={`/store`}>
                <span className="pr-3">
                  <ButtonContainer>Back to Products</ButtonContainer>
                </span>
              </Link>
              <ButtonContainer
                onClick={() => dispatch(addToCart(product, cart))}
              >
                Add to Cart
              </ButtonContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
// Use getInitalProps to get the cookie information and token
Item.getInitialProps = async ({ req, token, query }) => {
  const response = await axios.get(`${API}/store/${query.id}`);

  //   Item in response now
  return { product: response.data, token };
};
export default Item;
