import axios from "axios";
import Link from "next/link";
import PaypalButton from "../components/paypalbutton";
import { updateItem } from "./context/actions";
import { API } from "../config";
import { getCookieFromBrowser } from "../helpers/auth";

const DetailOrder = ({ orderDetail, state, dispatch }) => {
  const { orders, auth } = state;

  // console.log(orderDetail);

  const token = getCookieFromBrowser("token");
  // console.log(token);
  const handleDelivered = async (order) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const response = await axios.patch(
      `${API}/order/delivered/${order._id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.err) {
      return dispatch({ type: "NOTIFY", payload: { err: response.err } });
    }
    // console.log(response);
    const { paid, dateOfPayment, method, delivered } = response.data.result;

    dispatch(
      updateItem(
        orders,
        order._id,
        {
          ...order,
          paid,
          dateOfPayment,
          method,
          delivered,
        },
        "ADD_ORDERS"
      )
    );
    return dispatch({
      type: "NOTIFY",
      payload: { success: response.data.msg },
    });
  };

  if (!auth.user) return null;

  return (
    <>
      {orderDetail.map((order) => (
        <div key={order._id} className="row justify-content-around">
          <div
            className="text-uppercase my-3 p-3"
            style={{
              margin: "20px auto",
              backgroundColor: "white",
              width: "750px",
            }}
          >
            <h2 className="text-break">Order {order._id}</h2>
            <div className="mt-4 text-secondary">
              <h3>Shipping</h3>
              <hr />
              <p>Name: {order.user.name}</p>
              <p>Email: {order.user.email}</p>
              <p>Address: {order.address}</p>
              <p>Mobile: {order.mobile}</p>
              <div
                className={`alert ${
                  order.delivered ? "alert-success" : "alert-danger"
                } d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.delivered
                  ? `Delivered on ${order.updatedAt}`
                  : "Not delivered"}

                {auth.user.role === "admin" && !order.delivered && (
                  <button
                    className="btn btn-dark text-uppercase"
                    onClick={() => handleDelivered(order)}
                  >
                    Mark as delivered
                  </button>
                )}
              </div>

              <h3>Payment</h3>
              <hr />
              {order.method && (
                <>
                  <hr />
                  <h6>
                    Method: <em>{order.method}</em>
                  </h6>
                </>
              )}
              {order.paymentId && (
                <p>
                  PaymentId: <em>{order.paymentId}</em>
                </p>
              )}
              <div
                className={`alert ${
                  order.paid ? "alert-success" : "alert-danger"
                } d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.paid ? `Paid on ${order.dateOfPayment}` : "Not paid"}
              </div>

              <div className="text-center">
                <h3>Order Items</h3>
                <hr />
                {order.cart.map((item) => (
                  <div
                    className="row border-bottom mx-0 p-2 justify-content-between align-items-center"
                    key={item._id}
                    style={{ maxWidth: "950px" }}
                  >
                    <img
                      src={item.images[0]}
                      alt={item.images[0]}
                      style={{
                        width: "50px",
                        height: "45px",
                        objectFit: "cover",
                      }}
                      className="img-thumbnail"
                    />
                    <h6 className="text-secondary px-2 m-0">
                      <Link href={`/store/${item._id}`}>
                        <a>{item.name}</a>
                      </Link>
                    </h6>
                    <span className="text-info m-0">
                      {item.quantity} x ${item.price} = $
                      {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {!order.paid && auth.user.role !== "admin" && (
            <div className="p-4">
              <h2 className="mg-4 text-uppercase">Total: ${order.total}</h2>
              <PaypalButton order={order} />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default DetailOrder;
