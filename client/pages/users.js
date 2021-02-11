import Head from "next/head";
import { useContext } from "react";
import { ProductContext } from "../components/context/globalstate";
import Link from "next/link";
import Title from "../components/title";
import withAdmin from "./withAdmin";

const Users = () => {
  const { state, dispatch } = useContext(ProductContext);
  const { users, auth } = state;
  // console.log(users);

  // if (!auth.user) return null;

  return (
    <div
      className="table-responsive bg-white p-3"
      style={{ border: "1px solid black" }}
    >
      <Head>
        <title>Users</title>
      </Head>
      <Title title="users"></Title>
      <table className="table w-100">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u._id}>
              <th>{i + 1}</th>
              <th>{u._id}</th>
              <th>
                {" "}
                <img
                  src={u.avatar}
                  alt={u.avatar}
                  style={{
                    width: "30px",
                    height: "30px",
                    overflow: "hidden",
                    objectFit: "cover",
                  }}
                />
              </th>
              <th>{u.name}</th>
              <th>{u.email}</th>
              <th>
                {u.role === "admin" ? (
                  <i className="fas fa-check text-success">Admin</i>
                ) : (
                  <i className="fas fa-times text-danger"></i>
                )}
              </th>
              <th>
                <Link
                  href={
                    auth.user.email !== u.email ? `edit_user/${u._id}` : `#!`
                  }
                >
                  <a>
                    <i className="fas fa-edit text-info mr-2"></i>
                  </a>
                </Link>
                {auth.user.email !== u.email ? (
                  <i
                    className="fas fa-trash-alt text-danger ml-2"
                    title="Remove"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={() =>
                      dispatch({
                        type: "ADD_MODAL",
                        payload: [
                          {
                            data: users,
                            id: u._id,
                            name: u.name,
                            type: "ADD_USERS",
                          },
                        ],
                      })
                    }
                    style={{ cursor: "pointer" }}
                  ></i>
                ) : (
                  <i
                    className="fas fa-trash-alt text-danger ml-2"
                    title="Remove"
                  ></i>
                )}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withAdmin(Users);
