import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import { ProductContext } from "../../components/context/globalstate";
import { updateItem } from "../../components/context/actions";
import { useRouter } from "next/router";
import axios from "axios";
import { API } from "../../config";
import { getCookieFromBrowser } from "../../helpers/auth";

const EditUser = () => {
  const { state, dispatch } = useContext(ProductContext);
  const { users, auth } = state;
  const router = useRouter();

  const [editUser, setEditUser] = useState([]);
  const [checkAdmin, setCheckAdmin] = useState(false);
  const [num, setNum] = useState(0);

  useEffect(() => {
    users.forEach((user) => {
      if (user._id === router.query.id) {
        setEditUser(user);
        setCheckAdmin(user.role === "admin") ? true : false;
      }
    });
  }, [users]);

  const handleCheck = () => {
    setCheckAdmin(!checkAdmin);
    setNum(num + 1);
  };

  const handleSubmit = async () => {
    try {
      //   Checking role
      let role = checkAdmin ? "admin" : "subscriber";
      // If remainder isn't 0, turn loading on and make a call to update the user
      if (num % 2 !== 0) {
        dispatch({ type: "NOTIFY", payload: { loading: true } });
        const response = await axios.patch(
          `${API}/users/${editUser._id}`,
          { role },
          {
            headers: {
              authorization: `Bearer ${auth.token}`,
              contentType: "application/json",
            },
          }
        );

        // Updating state reducer
        dispatch(
          updateItem(
            users,
            editUser._id,
            {
              ...editUser,
              role,
            },
            "ADD_USERS"
          )
        );
        //   Display success message
        return dispatch({
          type: "NOTIFY",
          payload: { success: response.data.msg },
        });
      }
    } catch (error) {
      if (error.response)
        return dispatch({
          type: "NOTIFY",
          payload: { error: error.response.data.error },
        });
    }
  };

  return (
    <div className="edit_user my-3 w-100">
      <Head>
        <title>Edit User</title>
      </Head>
      <div>
        <button className="btn btn-dark" onClick={() => router.back()}>
          <i className="fas fa-long-arrow-alt-left" aria-hidden>
            Go Back
          </i>
        </button>
      </div>
      <div
        className="col-md-4 mx-auto my-4 bg-white p-5 text-center"
        style={{ border: "1px solid black" }}
      >
        <h2 className="text-uppercase text-secondary">Edit User</h2>
        <div className="form-group">
          <label htmlFor="name" className="d-block">
            Name
          </label>
          <input type="text" id="name" defaultValue={editUser.name} disabled />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            defaultValue={editUser.email}
            disabled
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="isAdmin"
            style={{ transform: "translate(4px, -3px)" }}
          >
            isAdmin
          </label>
          <input
            type="checkbox"
            id="isAdmin"
            checked={checkAdmin}
            style={{ width: "20px", height: "20px" }}
            onChange={handleCheck}
          />
        </div>
        <button className="btn btn-dark" onClick={handleSubmit}>
          Update
        </button>
      </div>
    </div>
  );
};
export default EditUser;
