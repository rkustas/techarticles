import axios from "axios";
import { API } from "../config";
import Link from "next/link";
import Router from "next/router";
import { authenticate, isAuth } from "../helpers/auth";
import Head from "next/head";

// Create a state using hook
import { useState, useEffect, useContext } from "react";
import { ProductContext } from "../components/context/globalstate";

const Login = () => {
  // State where name,email,password are stored and function to update the state
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const { state, dispatch } = useContext(ProductContext);
  const { auth } = state;

  //   Destructure values from state
  const { email, password } = login;

  const handleChange = (name) => (e) => {
    //   Handling the changes, setting state upon typing
    setLogin({
      ...login,
      [name]: e.target.value,
    });
  };

  // Asynchronous call and response upon submitting form
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    try {
      const response = await axios.post(`${API}/login`, {
        email,
        password,
      });
      //   console.log(response);
      // If valid response, then store the user and token
      authenticate(response, () => {
        dispatch({
          type: "NOTIFY",
          payload: { success: response.data.msg },
        });
        dispatch({
          type: "AUTH",
          payload: {
            token: response.data.token,
            user: response.data.user,
          },
        });
        //   Redirect to homepage if successful login
        auth.user && auth.user.role === "admin"
          ? Router.push("/admin")
          : Router.push("/user");
      });
    } catch (error) {
      // console.log(error);
      // If error in response, return current state, and error message
      setLogin({
        ...login,
      });
      if (error.response)
        return dispatch({
          type: "NOTIFY",
          payload: { error: error.response.data.error },
        });
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
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
        />
      </div>
      <div className="form-group text-center">
        <button className="btn btn-dark btn-block">Login</button>
      </div>
    </form>
  );

  return (
    <>
      <div>
        <Head>
          <title>Login</title>
        </Head>
      </div>
      <main>
        <div
          className="col-md-6 offset-md-3 bg-white p-3"
          style={{ border: "1px solid black" }}
        >
          <h1>Login</h1>
          <br />
          {loginForm()}
          <p className="text-center mt-2">
            <Link href="/auth/password/forgot">
              <a style={{ color: "crimson" }}>Forgot Password</a>
            </Link>
          </p>
          <p className="text-center mt-2">
            <span className="mr-2">Don't have an account?</span>
            <Link href="/register">
              <a style={{ color: "blue" }}>Sign up</a>
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Login;
