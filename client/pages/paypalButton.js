import React, { useEffect, useRef } from "react";
import { API } from "../config";
import axios from "axios";

const PaypalButton = ({ total, address, mobile, state, dispatch, token }) => {
  const refPaypalBtn = useRef();
  const { cart } = state;

  const postData = async () => {
    const res = await axios.post(
      `${API}/order`,
      { address, mobile, cart, total },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res);

    if (res.err) {
      return dispatch({ type: "NOTIFY", payload: { error: res.data.err } });
    }
    dispatch({ type: "ADD_CART", payload: [] });
    return dispatch({
      type: "NOTIFY",
      payload: {
        success: res.data.msg,
      },
    });
  };

  useEffect(() => {
    paypal
      .Buttons({
        createOrder: function (data, actions) {
          // This function sets up the details of the transaction, including the amount and line item details.
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total,
                },
              },
            ],
          });
        },
        onApprove: function (data, actions) {
          // This function captures the funds from the transaction.
          dispatch({ type: "NOTIFY", payload: { loading: true } });

          return actions.order.capture().then(function (details) {
            // This function shows a transaction success message to your buyer.
            postData();
            alert("Transaction completed by " + details.payer.name.given_name);
          });
        },
      })
      .render(refPaypalBtn.current);
  }, []);
  return <div ref={refPaypalBtn}></div>;
};

export default PaypalButton;
