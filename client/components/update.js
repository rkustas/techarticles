import axios from "axios";
import Router from "next/router";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
import { API } from "../config";
import { updateUser } from "../helpers/auth";
import { ProductContext } from "./context/globalstate";
import { useState, useContext, useEffect } from "react";
import Resizer from "react-image-file-resizer";

// Create a state using hook
const Profile = ({ user, token }) => {
  // State where name,email,password are stored and function to update the state
  const [state, setState] = useState({
    name: user.name,
    email: user.email,
    password: "",
    avatar: "",
    imgURL: "",
    loadedCategories: [],
    categories: user.categories,
  });

  const { dispatch } = useContext(ProductContext);

  //   Destructure values from state
  const {
    name,
    email,
    password,
    avatar,
    imgURL,
    loadedCategories,
    categories,
  } = state;

  // Load categories when component mounts, run whenever success changes
  useEffect(() => {
    loadCategories();
  }, [categories]);

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setState({ ...state, loadedCategories: response.data });
    } catch (error) {
      if (error.response)
        return dispatch({
          type: "NOTIFY",
          payload: { error: error.response.data },
        });
    }
  };

  const handleToggle = (c) => () => {
    //   function returning another function, return found index after searching category state or -1
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];

    if (clickedCategory === -1) {
      // Category wasn't found in state
      all.push(c);
    } else {
      // Remove category from all if category already found
      all.splice(clickedCategory, 1);
    }
    // console.log("all >> categories", all);
    setState({ ...state, categories: all });
  };

  //   Show Category checkbox
  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => (
        <li className="list-unstyled" key={c._id}>
          <input
            type="checkbox"
            onChange={handleToggle(c._id)}
            className="mr-2"
            checked={categories.includes(c._id)}
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const handleChange = (name) => (e) => {
    //   Handling the changes, setting state upon typing
    setState({
      ...state,
      [name]: e.target.value,
    });
  };

  // Asynchronous call and response upon submitting form
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    try {
      const response = await axios.put(
        `${API}/user`,
        {
          name,
          password,
          avatar,
          categories,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      updateUser(response.data.updated, () => {
        // If valid response, then reset the state and return a success message
        setState({
          ...state,
          avatar: "",
        });
        dispatch({
          type: "AUTH",
          payload: {
            token: token,
            user: response.data.updated,
          },
        });
        return dispatch({
          type: "NOTIFY",
          payload: { success: response.data.msg },
        });
      });
    } catch (error) {
      // console.log(error);
      // If error in response, return current state, and error message
      setState({
        ...state,
        avatar: "",
      });
      if (error.response)
        return dispatch({
          type: "NOTIFY",
          payload: { error: error.response.data.error },
        });
    }
  };

  const changeAvatar = (e) => {
    // console.log(e);
    const file = e.target.files[0];
    if (!file)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "File does not exist." },
      });
    if (file.size > 1024 * 1024)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "The largest image size is 1mb." },
      });
    if (file.type !== "image/jpeg" && file.type !== "image/png")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Image format is incorrect" },
      });

    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        // console.log(uri);
        setState({ ...state, avatar: uri, imgURL: file });
      },
      "base64"
    );
  };
  // console.log(state);

  const updateForm = () => (
    <form onSubmit={handleSubmit}>
      <h3 className="text-center text-uppercase">Profile</h3>
      <div className="profile_avatar">
        <img
          // src={user.avatar}
          src={imgURL ? URL.createObjectURL(imgURL) : user.avatar}
          alt="avatar"
        />
        <span>
          <i className="fas fa-camera"> </i>
          <p>Change</p>
          <input
            type="file"
            name="file"
            id="file_up"
            className="mb-3"
            onChange={changeAvatar}
            accept="image/*"
          />
        </span>
      </div>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          value={name}
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          placeholder="Type your name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={handleChange("email")}
          type="text"
          className="form-control"
          placeholder="Type your email"
          required
          disabled
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          placeholder="Type your password"
        />
      </div>
      <div className="form-check">
        <label className="text-muted ml-4">Category</label>
        <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
          {showCategories()}
        </ul>
      </div>
      <div className="form-group text-center">
        <button className="btn btn-outline-dark btn-block">Update</button>
      </div>
    </form>
  );

  return (
    <>
      <br />
      {updateForm()}
    </>
  );
};

export default Profile;
