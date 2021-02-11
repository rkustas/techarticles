import Link from "next/link";
import { useContext } from "react";
import { ProductContext } from "../context/globalstate";
import { addToCart } from "../context/actions";

const ProductItem = ({ product, handleCheck }) => {
  const { state, dispatch } = useContext(ProductContext);
  const { cart, auth } = state;
  // console.log(product);

  // console.log(isAuth());

  const userLink = () => {
    return (
      <>
        <Link href={`/store/${product._id}`}>
          <button
            className="btn btn-info text-capitalize mr-2"
            style={{ marginRight: "5px", flex: 1 }}
          >
            view
          </button>
        </Link>
        <button
          className="btn btn-success text-capitalize"
          onClick={() => {
            dispatch(addToCart(product, cart));
          }}
          disabled={product.inStock === 0 ? true : false}
          style={{ marginLeft: "5px", flex: 1 }}
        >
          add to cart
        </button>
      </>
    );
  };

  const adminLink = () => {
    return (
      <>
        <Link href={`create/${product._id}`}>
          <a className="btn btn-info" style={{ marginRight: "5px", flex: 1 }}>
            Edit
          </a>
        </Link>
        <button
          className="btn btn-danger"
          style={{ marginLeft: "5px", flex: 1 }}
          data-toggle="modal"
          data-target="#exampleModal"
          onClick={() =>
            dispatch({
              type: "ADD_MODAL",
              payload: [
                {
                  data: "",
                  id: product._id,
                  name: product.name,
                  type: "DELETE_PRODUCT",
                },
              ],
            })
          }
        >
          Delete
        </button>
      </>
    );
  };
  return (
    <div className="card" style={{ width: "20rem" }}>
      {auth.user && auth.user.role === "admin" && (
        <input
          type="checkbox"
          checked={product.checked}
          className="postion-absolute"
          style={{ height: "15px", width: "15px" }}
          onChange={() => {
            handleCheck(product._id);
          }}
        />
      )}
      <img
        src={product.images[0]}
        height="200px"
        width="200px"
        alt={product.images[0]}
        className="card-img-top"
      />
      <div className="card-body">
        <h5 className="card-title text-capitalize" title={product.name}>
          {product.name}
        </h5>

        {/* card footer */}
        <div className="row justify-content-between mx-0">
          <h6 className="text-danger">${product.price}</h6>
          {product.inStock > 0 ? (
            <h6 className="text-danger">In Stock: {product.inStock}</h6>
          ) : (
            <h6 className="text-danger">Out of Stock</h6>
          )}
        </div>
        <p className="card-text" title={product.description}>
          {product.description}
        </p>
        <div className="row justify-content-between mx-0">
          {/* {adminLink()} */}
          {!auth.user || auth.user.role !== "admin" ? userLink() : adminLink()}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
