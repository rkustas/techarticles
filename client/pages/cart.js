import EmptyCart from "../components/cart/cart-page/emptycart";
import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import { ProductContext } from "../components/context/globalstate";
import CartItem from "../components/cart/cart-page/cartitem";
import Link from "next/link";
import { isAuth } from "../helpers/auth";
import { ButtonContainer } from "../components/button";
import PaypalButton from "./paypalButton";
import { getCookie } from "../helpers/auth";
import axios from "axios";
import { API } from "../config";

const Cart = ({ token }) => {
  const { state, dispatch } = useContext(ProductContext);
  const { cart } = state;

  // State
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [payment, setPayment] = useState(false);

  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.Price * item.count;
      }, 0);
      const resrounded = res.toFixed(2);
      setTotal(resrounded);
    };

    getTotal();
  }, [cart]);

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem("_next__cart01__devat"));
    if (cartLocal && cartLocal.length > 0) {
      let newArr = [];
      const updateCart = async () => {
        for (const item of cartLocal) {
          const response = await axios.get(`${API}/store/${item._id}`);
          const { _id, Name, Price, inStock, Image, sold } = response.data;
          if (inStock > 0) {
            newArr.push({
              _id,
              Name,
              Price,
              Image,
              inCart: true,
              sold,
              inStock,
              count: item.count > inStock ? 1 : item.count,
            });
          }
        }
        dispatch({ type: "ADD_CART", payload: newArr });
      };
      updateCart();
    }
  }, []);

  const handlePayment = () => {
    if (!address || !mobile)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Please add your address and mobile." },
      });
    setPayment(true);
  };

  if (cart.length === 0) return <EmptyCart />;
  return (
    <div className="row mx-auto">
      <Head>
        <title>Cart</title>
      </Head>
      <div className="col-md-8 text-secondary table-responsive my-3">
        <h1 className="text-2xl mb-5 text-uppercase">Shopping Cart</h1>
        <table className="table my-3 bg-white">
          <tbody>
            {cart.length &&
              cart.map((product) => (
                <CartItem
                  key={product._id}
                  product={product}
                  dispatch={dispatch}
                  cart={cart}
                />
              ))}
          </tbody>
        </table>
      </div>
      <div className="col-md-4 my-3 text-right text-uppercase text-secondary ">
        <form>
          <h2>Shipping</h2>

          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            className="form-control mb-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <label htmlFor="mobile">Mobile</label>
          <input
            type="text"
            name="mobile"
            id="mobile"
            className="form-control mb-2"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <h3>
            Total: <span className="text-danger">${total}</span>
          </h3>

          <span className="px-2">
            <Link href={"/store"}>
              <ButtonContainer>continue shopping</ButtonContainer>
            </Link>
            {payment ? (
              <PaypalButton
                total={total}
                address={address}
                mobile={mobile}
                state={state}
                dispatch={dispatch}
                token={token}
              />
            ) : (
              <Link href={isAuth() ? "#!" : "/login"}>
                <ButtonContainer onClick={handlePayment}>
                  proceed with payment
                </ButtonContainer>
              </Link>
            )}
          </span>
        </form>
      </div>
    </div>
  );
};

// Use getInitalProps to get the cookie information and token
Cart.getInitialProps = ({ req }) => {
  const token = getCookie("token", req);
  return { token };
};

export default Cart;
