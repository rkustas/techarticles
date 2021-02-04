import axios from "axios";
import Link from "next/link";
import PaypalButton from "../components/paypalButton";
import { isAuth } from "../helpers/auth";
import { updateItem } from "./context/actions";
import { API } from "../config";
import { getCookieFromBrowser } from "../helpers/auth";

const DetailOrder = ({ orderDetail, state, dispatch }) => {
  const { orders } = state;

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

  if (!isAuth()) return null;

  return (
    <>
      {orderDetail.map((order) => (
        <div key={order._id} className="row justify-content-around">
          <div
            className="text-uppercase my-3 p-3"
            style={{
              margin: "20px auto",
              backgroundColor: "white",
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

                {isAuth().role === "admin" && !order.delivered && (
                  <button
                    className="btn btn-dark text-uppercase"
                    onClick={() => handleDelivered(order)}
                  >
                    Mark as delivered
                  </button>
                )}
              </div>

              <h3>Payment</h3>
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

              <div>
                <h3>Order Items</h3>
                <hr />
                {order.cart.map((item) => (
                  <div
                    className="row border-bottom mx-0 p-2 justify-content-between align-items-center"
                    key={item._id}
                    style={{ maxWidth: "950px" }}
                  >
                    <img
                      src={item.Image}
                      alt={item.Image}
                      style={{
                        width: "50px",
                        height: "45px",
                        objectFit: "cover",
                      }}
                    />
                    <h6 className="text-secondary px-2 m-0">
                      <Link href={`/store/${item._id}`}>
                        <a>{item.Name}</a>
                      </Link>
                    </h6>
                    <span className="text-info m-0">
                      {item.count} x ${item.Price} = ${item.Price * item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {!order.paid && isAuth().role !== "admin" && (
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
