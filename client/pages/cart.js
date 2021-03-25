import EmptyCart from "../components/cart/cart-page/emptycart";
import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import { ProductContext } from "../components/context/globalstate";
import CartItem from "../components/cart/cart-page/cartitem";
import Link from "next/link";
import { getCookie } from "../helpers/auth";
import axios from "axios";
import { API } from "../config";
import { useRouter } from "next/router";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { emptyCart } from "../components/context/actions";

const Cart = ({ token }) => {
  // console.log(token);
  const { state, dispatch } = useContext(ProductContext);
  const { cart, orders, auth } = state;

  // State
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  const [callback, setCallback] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
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
          const {
            _id,
            name,
            price,
            inStock,
            images,
            sold,
            productnumber,
          } = response.data;
          if (inStock > 0) {
            newArr.push({
              _id,
              name,
              price,
              images,
              sold,
              productnumber,
              inStock,
              quantity: item.quantity > inStock ? 1 : item.quantity,
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
      user: {
        _id: auth.user._id,
        email: auth.user.email,
        name: auth.user.name,
      },
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
    if (!auth.user) {
      router.push("/login");
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Please login to purchase an item." },
      });
    }
    if (!address || !mobile)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Please add your address and mobile." },
      });

    // If the item is inStock push it into a new cart array
    let newCart = [];
    for (const item of cart) {
      const response = await axios.get(`${API}/store/${item._id}`);
      if (response.data.inStock - item.quantity >= 0) {
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
    <div
      className="row mx-auto bg-white p-3"
      style={{ border: "1px solid black" }}
    >
      <Head>
        <title>Cart</title>
      </Head>
      <div className="col-md-8 text-secondary table-responsive my-3">
        <h1 className="text-2xl mb-5 text-uppercase">Shopping Cart</h1>
        <button
          className="btn btn-danger btn-lg"
          onClick={() => {
            dispatch(emptyCart());
            dispatch({
              type: "NOTIFY",
              payload: { success: "Cart is empty" },
            });
            router.push("/store");
          }}
        >
          <RemoveShoppingCartIcon fontSize="large" />
          Clear Cart
        </button>
        <table className="table my-3">
          <tbody>
            {cart.length &&
              cart.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
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
          <div className="text-center">
            <span>
              <Link href={"/store"}>
                <button className="btn btn-outline-danger mr-2 my-2">
                  Continue Shopping
                </button>
              </Link>
            </span>
            <span>
              <Link href={"#!"}>
                <button
                  className="btn btn-outline-success"
                  onClick={handlePayment}
                >
                  Proceed with Payment
                </button>
              </Link>
            </span>
          </div>
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
