import Layout from "../components/layout";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
import { API } from "../config";
import Link from "next/link";
import Router from "next/router";
import { authenticate, isAuth } from "../helpers/auth";

// Create a state using hook
import { useState, useEffect } from "react";

const Login = () => {
  // State where name,email,password are stored and function to update the state
  const [state, setState] = useState({
    email: "reactawsmongo@gmail.com",
    password: "RyKu001!",
    error: "",
    success: "",
    buttonText: "Login",
  });

  // Runs when component mounts and unmounts
  useEffect(() => {
    isAuth() && Router.push("/");
  });

  //   Destructure values from state
  const { email, password, error, success, buttonText } = state;

  const handleChange = (name) => (e) => {
    //   Handling the changes, setting state upon typing
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Login",
    });
  };

  // Asynchronous call and response upon submitting form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Logging in" });
    try {
      const response = await axios.post(`${API}/login`, {
        email,
        password,
      });
      //   console.log(response);
      // If valid response, then store the user and token
      authenticate(response, () => {
        //   Redirect to homepage if successful login
        isAuth() && isAuth().role === "admin"
          ? Router.push("/admin")
          : Router.push("/user");
      });
    } catch (error) {
      console.log(error);
      // If error in response, return current state, and error message
      setState({
        ...state,
        buttonText: "Login",
        error: error.response.data.error,
      });
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
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
        <button className="btn btn-outline-dark">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1>Login</h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {loginForm()}
        <Link href="/auth/password/forgot">
          <a className="text-dark float-right">Forgot Password</a>
        </Link>
      </div>
    </Layout>
  );
};

export default Login;
