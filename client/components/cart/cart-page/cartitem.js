import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import Link from "next/link";
import { decrease, increase } from "../../context/actions";

const CartItem = ({ item, dispatch, cart }) => {
  return (
    <>
      <tr>
        <td style={{ width: "100px", overflow: "hidden" }}>
          <img
            src={item.images[0]}
            className="img-thumbnail w-110"
            alt={item.name}
            style={{ minWidth: "80px", height: "80px" }}
          />
        </td>
        <td className="align-middle" style={{ minWidth: "200px" }}>
          <h5 className="text-capitalize">
            <Link href={`/store/${item._id}`}>
              <a className="text-secondary">{item.name}</a>
            </Link>
          </h5>
          <h6 className="text-danger">${item.quantity * item.price}</h6>
          {item.inStock > 0 ? (
            <p className="mb-1 text-danger">In Stock: {item.inStock}</p>
          ) : (
            <p className="mb-1 text-danger">Out of Stock</p>
          )}
        </td>
      </tr>
      <div className="text-center">
        <span>QTY: {item.quantity}</span>
        <div className="my-2">
          <span>
            <button
              className="btn btn-outline-primary"
              onClick={() => dispatch(increase(cart, item._id))}
              disabled={item.quantity === item.inStock ? true : false}
            >
              <AddCircleIcon color="primary" />
            </button>
            {item.quantity > 1 && (
              <button
                className="btn btn-outline-danger"
                onClick={() => dispatch(decrease(cart, item._id))}
              >
                <RemoveCircleIcon color="secondary" />
              </button>
            )}
          </span>
          <span>
            {item.quantity === 1 && (
              <button className="btn btn-outline-danger">
                <DeleteIcon
                  color="secondary"
                  data-toggle="modal"
                  data-target="#exampleModal"
                  onClick={() =>
                    dispatch({
                      type: "ADD_MODAL",
                      payload: [
                        {
                          data: cart,
                          id: item._id,
                          name: item.name,
                          type: "ADD_CART",
                        },
                      ],
                    })
                  }
                />
              </button>
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default CartItem;
