import { createContext } from "react";
import React, { useReducer, useEffect } from "react";
import reducers from "./reducers";
import axios from "axios";
import { API } from "../../config";
import { getCookieFromBrowser, isAuth } from "../../helpers/auth";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const initialState = {
    notify: {},
    auth: {},
    cart: [],
    modal: [],
    orders: [],
    users: [],
    categories: [],
    artCategories: [],
  };
  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart, auth } = state;

  const token = getCookieFromBrowser("token");

  useEffect(async () => {
    if (token && isAuth()) {
      dispatch({
        type: "AUTH",
        payload: {
          token: token,
          user: isAuth(),
        },
      });
    }
    const responseCategories = await axios.get(`${API}/productCategories`);
    // console.log(response);
    if (responseCategories.error)
      return dispatch({
        type: "NOTIFY",
        payload: { error: responseCategories.error },
      });
    dispatch({
      type: "ADD_CATEGORIES",
      payload: responseCategories.data.categories,
    });
    const responseArticle = await axios.get(`${API}/categories`);
    // console.log(responseArticle);
    if (responseArticle.error)
      return dispatch({
        type: "NOTIFY",
        payload: { error: responseArticle.error },
      });
    dispatch({
      type: "ADD_ARTICLE_CAT",
      payload: responseArticle.data,
    });
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
    if (auth.token) {
      const response = await axios.get(`${API}/user`, {
        headers: {
          authorization: `Bearer ${auth.token}`,
          contentType: "application/json",
        },
      });
      // console.log(response);
      if (response.err) {
        return dispatch({ type: "NOTIFY", payload: { error: response.err } });
      }
      dispatch({ type: "ADD_ORDERS", payload: response.data.orders });

      if (auth.user.role === "admin") {
        const userResponse = await axios.get(`${API}/users`, {
          headers: {
            authorization: `Bearer ${auth.token}`,
            contentType: "application/json",
          },
        });
        // console.log(response);
        if (userResponse.err) {
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
  }, [auth.token]);

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};
