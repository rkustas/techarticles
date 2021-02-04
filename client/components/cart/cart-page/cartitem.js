import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import Link from "next/link";
import { decrease, increase } from "../../context/actions";
import { ButtonContainer } from "../../button";

const CartItem = ({ product, dispatch, cart }) => {
  return (
    <tr>
      <td style={{ width: "100px", overflow: "hidden" }}>
        <img
          src={product.Image}
          className="img-thumbnail w-110"
          alt={product.Name}
          style={{ minWidth: "80px", height: "80px" }}
        />
      </td>
      <td className="w-50 align-middle" style={{ minWidth: "200px" }}>
        <h5 className="text-capitalize">
          <Link href={`/store/${product._id}`}>
            <a className="text-secondary">{product.Name}</a>
          </Link>
        </h5>
        <h6 className="text-danger">${product.count * product.Price}</h6>
        {product.inStock > 0 ? (
          <p className="mb-1 text-danger">In Stock: {product.inStock}</p>
        ) : (
          <p className="mb-1 text-danger">Out of Stock</p>
        )}
      </td>

      <td className="align-middle" style={{ minWidth: "50px" }}>
        <span className="px-3">QTY: {product.count}</span>
        <button
          className="btn btn-outline-primary"
          onClick={() => dispatch(increase(cart, product._id))}
          disabled={product.count === product.inStock ? true : false}
        >
          <AddCircleIcon color="primary" />
        </button>
        {product.count > 1 && (
          <button
            className="btn btn-outline-danger"
            onClick={() => dispatch(decrease(cart, product._id))}
          >
            <RemoveCircleIcon color="secondary" />
          </button>
        )}
        {product.count === 1 && (
          <button className="btn btn-outline-danger">
            <DeleteIcon
              color="secondary"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={() =>
                dispatch({
                  type: "ADD_MODAL",
                  payload: {
                    data: cart,
                    id: product._id,
                    name: product.Name,
                    type: "ADD_CART",
                  },
                })
              }
            />
          </button>
        )}
      </td>
    </tr>
  );
};

export default CartItem;
