import { createContext } from "react";
import React, { useReducer, useEffect } from "react";
import reducers from "./reducers";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const initialState = { notify: {}, auth: {}, cart: [], modal: {} };
  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart } = state;

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

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};
