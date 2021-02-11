// Dynamic id, only available through next.js the jwt token from auth link in registration email
import { useContext, useState } from "react";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { API } from "../../../config";
import Router from "next/router";
import Layout from "../../../components/layout";
import Head from "next/head";
import { ProductContext } from "../../../components/context/globalstate";

const forgotPassword = () => {
  // Create state to store token
  const [state, setState] = useState({
    email: "",
  });

  const { dispatch } = useContext(ProductContext);

  // Destructure state variables
  const { email } = state;

  const handleChange = (e) => {
    setState({ ...state, email: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    // console.log("Post email to", email);
    try {
      const response = await axios.put(`${API}/forgot-password`, { email });
      //   console.log("FORGOT PASSWORD", response);
      setState({
        ...state,
        email: "",
      });
      dispatch({
        type: "NOTIFY",
        payload: { success: response.data.msg },
      });
    } catch (error) {
      // console.log("FORGOT PW ERROR", error);
      setState({
        ...state,
      });
      if (error.response)
        return dispatch({
          type: "NOTIFY",
          payload: { error: error.response.data.error },
        });
    }
  };

  const passwordForgotForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="form-control"
          onChange={handleChange}
          value={email}
        />
      </div>
      <div>
        <button className="btn btn-dark btn-block">Send Email</button>
      </div>
    </form>
  );

  return (
    <>
      <div>
        <Head>
          <title>Forgot Password</title>
        </Head>
      </div>
      <div className="row">
        <div
          className="col-md-6 offset-md-3 bg-white p-5"
          style={{ border: "1px solid black" }}
        >
          <h1>Forgot Password</h1>
          <br />
          {/* If successful show success message */}
          {passwordForgotForm()}
        </div>
      </div>
    </>
  );
};

export default forgotPassword;
