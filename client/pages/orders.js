import { useContext, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { ProductContext } from "../components/context/globalstate";
import Title from "../components/title";

const UsersOrders = () => {
  const { state, dispatch } = useContext(ProductContext);
  const { orders } = state;
  // console.log(orders, users);

  const listOfOrders = () =>
    orders.map((order) => (
      <tr key={order._id}>
        <td className="p-2">
          <Link href={`/order/${order._id}`}>
            <a>{order._id}</a>
          </Link>
        </td>
        <td className="p-2">
          {new Date(order.createdAt).toLocaleDateString()}
        </td>
        <td className="p-2">${order.total}</td>
        <td className="p-2">
          {order.delivered ? (
            <i className="fas fa-check text-success"></i>
          ) : (
            <i className="fas fa-times text-danger"></i>
          )}
        </td>
        <td className="p-2">
          {order.paid ? (
            <i className="fas fa-check text-success"></i>
          ) : (
            <i className="fas fa-times text-danger"></i>
          )}
        </td>
      </tr>
    ));

  return (
    <>
      <Head>
        <title>My Orders</title>
      </Head>
      <Title title="Orders"></Title>
      <div className="bg-white p-3" style={{ border: "1px solid black" }}>
        <div className="my-3 table-responsive">
          <table className="table-bordered table-hover w-100 text-uppercase">
            <thead className="bg-light">
              <tr>
                <td className="p-2">id</td>
                <td className="p-2">date</td>
                <td className="p-2">total</td>
                <td className="p-2">delivered</td>
                <td className="p-2">paid</td>
              </tr>
            </thead>
            <tbody>{listOfOrders()}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default UsersOrders;
