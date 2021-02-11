import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { ProductContext } from "../../components/context/globalstate";
import DetailOrder from "../../components/orderdetail";

const OrderDetail = () => {
  const router = useRouter();

  // console.log(router);

  const { state, dispatch } = useContext(ProductContext);
  const { orders, auth } = state;
  // console.log(orders);

  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    const newArr = orders.filter((order) => order._id === router.query.id);
    setOrderDetail(newArr);
  }, [orders]);
  // console.log(orderDetail);

  if (!auth.user) return null;

  return (
    <div className="my-3">
      <Head>
        <title>Order Detail</title>
      </Head>
      <div>
        <button className="btn btn-dark" onClick={() => router.back()}>
          <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i>
          Go Back
        </button>
      </div>
      <DetailOrder
        orderDetail={orderDetail}
        state={state}
        dispatch={dispatch}
      />
    </div>
  );
};

export default OrderDetail;
