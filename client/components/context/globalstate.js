import { createContext } from "react";
import React, { useReducer, useEffect } from "react";
import reducers from "./reducers";
import { getCookieFromBrowser, isAuth } from "../../helpers/auth";
import axios from "axios";
import { API } from "../../config";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const initialState = {
    notify: {},
    auth: {},
    cart: [],
    modal: {},
    orders: [],
    users: [],
    categories: [],
  };
  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart } = state;

  const token = getCookieFromBrowser("token");

  useEffect(async () => {
    if (token) {
      const response = await axios.get(`${API}/productCategories`, {
        headers: {
          authorization: `Bearer ${token}`,
          contentType: "application/json",
        },
      });
      console.log(response);
      if (response.error)
        return dispatch({ type: "NOTIFY", payload: { error: response.error } });
      dispatch({ type: "ADD_CATEGORIES", payload: response.data.categories });
    } else {
      dispatch({ type: "ADD_CATEGORIES", payload: [] });
    }
  }, []);

  useEffect(() => {
    const _next__cart01__devat = JSON.parse(
      localStorage.getItem("_next__cart01__devat")
    );
    if (_next__cart01__devat) {
      dispatch({ type: "ADD_CART", payload: _next__cart01__devat });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("_next__cart01__devat", JSON.stringify(cart));
  }, [cart]);

  useEffect(async () => {
    if (token) {
      const response = await axios.get(`${API}/user`, {
        headers: {
          authorization: `Bearer ${token}`,
          contentType: "application/json",
        },
      });
      // console.log(response);
      if (response.err) {
        return dispatch({ type: "NOTIFY", payload: { error: response.err } });
      }
      dispatch({ type: "ADD_ORDERS", payload: response.data.orders });

      if (isAuth().role === "admin") {
        const userResponse = await axios.get(`${API}/users`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: "application/json",
          },
        });
        // console.log(response);
        if (response.err) {
          return dispatch({
            type: "NOTIFY",
            payload: { error: userResponse.err },
          });
        }
        dispatch({ type: "ADD_USERS", payload: userResponse.data.users });
      }
    } else {
      dispatch({ type: "ADD_ORDERS", payload: [] });
      dispatch({ type: "ADD_USERS", payload: [] });
    }
  }, [token]);

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};
