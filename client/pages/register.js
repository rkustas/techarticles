import Layout from "../components/layout";
import axios from "axios";
import Router from "next/router";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
import { API } from "../config";
import { isAuth } from "../helpers/auth";

// Create a state using hook
import { useState, useEffect } from "react";

const Register = () => {
  // State where name,email,password are stored and function to update the state
  const [state, setState] = useState({
    name: "Ryan",
    email: "rk@gmail.com",
    password: "6666644",
    error: "",
    success: "",
    buttonText: "Register",
    loadedCategories: [],
    categories: [],
  });

  // Runs when component mounts and unmounts
  useEffect(() => {
    isAuth() && Router.push("/");
  });

  //   Destructure values from state
  const {
    name,
    email,
    password,
    error,
    success,
    buttonText,
    loadedCategories,
    categories,
  } = state;

  // Load categories when component mounts, run whenever success changes
  useEffect(() => {
    loadCategories();
  }, []);

  // Load categories
  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
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
    console.log("all >> categories", all);
    setState({ ...state, categories: all, success: "", error: "" });
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
      error: "",
      success: "",
      buttonText: "Register",
    });
  };

  // Asynchronous call and response upon submitting form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Registering" });
    try {
      const response = await axios.post(`${API}/register`, {
        name,
        email,
        password,
        categories,
      });
      console.log(response);
      // If valid response, then reset the state and return a success message
      setState({
        ...state,
        name: "",
        email: "",
        password: "",
        buttonText: "Submitted",
        success: response.data.message,
      });
    } catch (error) {
      console.log(error);
      // If error in response, return current state, and error message
      setState({
        ...state,
        buttonText: "Register",
        error: error.response.data.error,
      });
    }
  };

  // const handleSubmit = (e) => {
  //   setState({ ...state, buttonText: "Registering" });
  //   //   Handle submitting the form, where the data is posted to db
  //   e.preventDefault();
  //   // console.table({ name, email, password });
  //   axios
  //     .post(`http://localhost:8000/api/register`, {
  //       name,
  //       email,
  //       password,
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       // If valid response, then reset the state and return a success message
  //       setState({
  //         ...state,
  //         name: "",
  //         email: "",
  //         password: "",
  //         buttonText: "Submitted",
  //         success: response.data.message,
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       // If error in response, return current state, and error message
  //       setState({
  //         ...state,
  //         buttonText: "Register",
  //         error: error.response.data.error,
  //       });
  //     });
  // };
  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
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
        <input
          value={email}
          onChange={handleChange("email")}
          type="text"
          className="form-control"
          placeholder="Type your email"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={password}
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          placeholder="Type your password"
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted ml-4">Category</label>
        <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
          {showCategories()}
        </ul>
      </div>
      <div className="form-group">
        <button className="btn btn-outline-dark">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1>Register</h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {registerForm()}
      </div>
    </Layout>
  );
};

export default Register;
