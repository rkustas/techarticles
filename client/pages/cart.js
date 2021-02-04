import EmptyCart from "../components/cart/cart-page/emptycart";
import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import { ProductContext } from "../components/context/globalstate";
import CartItem from "../components/cart/cart-page/cartitem";
import Link from "next/link";
import { isAuth } from "../helpers/auth";
import { ButtonContainer } from "../components/button";
import PaypalButton from "../components/paypalButton";
import { getCookie } from "../helpers/auth";
import axios from "axios";
import { API } from "../config";
import { useRouter } from "next/router";

const Cart = ({ token }) => {
  console.log(token);
  const { state, dispatch } = useContext(ProductContext);
  const { cart, orders } = state;

  // State
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  const [callback, setCallback] = useState(false);

  const router = useRouter();

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
          const { _id, Name, Price, inStock, Image, sold, id } = response.data;
          if (inStock > 0) {
            newArr.push({
              _id,
              Name,
              Price,
              Image,
              inCart: true,
              sold,
              id,
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
    // console.log(res);

    if (res.err) {
      return dispatch({ type: "NOTIFY", payload: { error: res.data.err } });
    }

    dispatch({ type: "ADD_CART", payload: [] });
    const newOrder = {
      ...res.data.order,
      user: { _id: isAuth()._id, email: isAuth().email, name: isAuth().name },
    };
    dispatch({ type: "ADD_ORDERS", payload: [...orders, newOrder] });

    dispatch({
      type: "NOTIFY",
      payload: {
        success: res.data.msg,
      },
    });
    return router.push(`/order/${res.data.order._id}`);
  };

  const handlePayment = async () => {
    if (!address || !mobile)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Please add your address and mobile." },
      });

    // If the item is inStock push it into a new cart array
    let newCart = [];
    for (const item of cart) {
      const response = await axios.get(`${API}/store/${item._id}`);
      if (response.data.inStock - item.count >= 0) {
        newCart.push(item);
      }
    }
    // Checking if product out of stock before you can complete an order
    if (newCart.length < cart.length) {
      setCallback(!callback);
      return dispatch({
        type: "NOTIFY",
        payload: {
          error: "The product is out of stock or the quantity is insufficient",
        },
      });
    }
    // Set the loading to true
    dispatch({
      type: "NOTIFY",
      payload: {
        loading: true,
      },
    });
    // posting order, which reroutes to order detail upon completion
    postData();
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

          <span className="text-center px-3">
            <>
              <Link href={"/store"}>
                <button className="btn btn-outline-danger mr-3">
                  Continue Shopping
                </button>
              </Link>
              <Link href={isAuth() ? "#!" : "/login"}>
                <button
                  className="btn btn-outline-success"
                  onClick={handlePayment}
                >
                  Proceed with Payment
                </button>
              </Link>
            </>
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
