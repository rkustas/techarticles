import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { ProductContext } from "../context/globalstate";

const CartIcon = () => {
  const { state, dispatch } = useContext(ProductContext);
  const { cart } = state;
  const router = useRouter();
  const isActive = (r) => {
    if (r === router.pathname) {
      return " active";
    } else {
      return "";
    }
  };

  return (
    <React.Fragment>
      <li className="nav-item">
        <Link href="/cart">
          <a className={"nav-link" + isActive("/cart")}>
            <i
              className="fas fa-shopping-cart position-relative"
              aria-hidden="true"
            >
              {cart.length ? (
                <span
                  className="position-absolute"
                  style={{
                    padding: "3px 6px",
                    background: "#ed143dc2",
                    borderRadius: "50%",
                    top: "-10px",
                    right: "-10px",
                    color: "white",
                    fontSize: "14px",
                  }}
                >
                  {cart.length}
                </span>
              ) : (
                ""
              )}
            </i>
            Cart
          </a>
        </Link>
      </li>
    </React.Fragment>
  );
};

export default CartIcon;
