import axios from "axios";
import Router from "next/router";
import { API } from "../config";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

// Create a state using hook
import { useState, useEffect, useContext } from "react";
import { ProductContext } from "../components/context/globalstate";

const Register = () => {
  // State where name,email,password are stored and function to update the state
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    cf_password: "",
    loadedCategories: [],
    categories: [],
  });

  const { state, dispatch } = useContext(ProductContext);
  const { auth } = state;

  const router = useRouter();

  // Runs when component mounts and unmounts
  useEffect(() => {
    auth.user && Router.push("/");
  });

  //   Destructure values from state
  const {
    name,
    email,
    password,
    cf_password,
    loadedCategories,
    categories,
  } = register;

  // Load categories when component mounts, run whenever success changes
  useEffect(() => {
    loadCategories();
  }, [categories]);

  // Load categories
  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setRegister({ ...register, loadedCategories: response.data });
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
    setRegister({ ...register, categories: all });
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
    setRegister({
      ...register,
      [name]: e.target.value,
    });
  };

  // Asynchronous call and response upon submitting form
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    try {
      const response = await axios.post(`${API}/register`, {
        name,
        email,
        password,
        cf_password,
        categories,
      });
      // console.log(response);
      // If valid response, then reset the state and return a success message
      setState({
        ...state,
        name: "",
        email: "",
        password: "",
        cf_password: "",
      });
      dispatch({
        type: "NOTIFY",
        payload: { success: response.data.msg },
      });

      return router.push("/login");
    } catch (error) {
      // console.log(error);
      // console.log(error);
      // If error in response, return current state, and error message
      setRegister({
        ...register,
      });
      if (error.response)
        return dispatch({
          type: "NOTIFY",
          payload: { error: error.response.data.error },
        });
    }
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          value={name}
          onChange={handleChange("name")}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={handleChange("email")}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          aria-describedby="passwordHelp"
        />
        <small id="passwordHelp" className="form-text text-danger">
          Must be 6 or more characters
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="cf_password">Confirm Password</label>
        <input
          value={cf_password}
          onChange={handleChange("cf_password")}
          type="password"
          className="form-control"
        />
      </div>
      <div className="form-check">
        <label className="text-muted ml-4">Category</label>
        <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
          {showCategories()}
        </ul>
      </div>
      <div className="form-group text-center">
        <button className="btn btn-dark btn-block">Register</button>
      </div>
    </form>
  );

  return (
    <>
      <div>
        <Head>
          <title>Register</title>
        </Head>
      </div>
      <div
        className="col-md-6 offset-md-3 bg-white p-3"
        style={{ border: "1px solid black" }}
      >
        <h1>Register</h1>
        <br />
        {registerForm()}
      </div>
      <p className="text-center mt-2">
        <span className="mr-2">Already Registered?</span>
        <Link href="/login">
          <a style={{ color: "blue" }}>Login</a>
        </Link>
      </p>
    </>
  );
};

export default Register;
