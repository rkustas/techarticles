import React from "react";
import { useContext } from "react";
import { ButtonContainer } from "../button";
import { ProductContext } from "../../components/context/globalstate";
import { addToCart } from "../context/actions";

const AddToCartButton = ({ product }) => {
  const { state, dispatch } = useContext(ProductContext);
  const { cart } = state;
  //   console.log(item);

  return (
    <React.Fragment>
      <button
        className="btn btn-success text-capitalize"
        onClick={() => {
          dispatch(addToCart(product, cart));
        }}
        disabled={product.inStock === 0 ? true : false}
      >
        add to cart
      </button>
    </React.Fragment>
  );
};
export default AddToCartButton;
