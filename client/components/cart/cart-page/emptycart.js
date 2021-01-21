import React from "react";
import Title from "../../title";

export default function EmptyCart() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-10 mx-auto text-center">
          <Title name="your cart is currently empty" />
        </div>
      </div>
    </div>
  );
}
