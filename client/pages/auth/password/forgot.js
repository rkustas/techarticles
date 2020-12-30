// Dynamic id, only available through next.js the jwt token from auth link in registration email
import { useState } from "react";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { API } from "../../../config";
import Router from "next/router";
import Layout from "../../../components/Layout";

const forgotPassword = () => {
  // Create state to store token
  const [state, setState] = useState({
    email: "",
    buttonText: "Send Email",
    success: "",
    error: "",
  });
  // Destructure state variables
  const { email, buttonText, success, error } = state;

  const handleChange = (e) => {
    setState({ ...state, email: e.target.value, success: "", error: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Post email to", email);
    try {
      const response = await axios.put(`${API}/forgot-password`, { email });
      //   console.log("FORGOT PASSWORD", response);
      setState({
        ...state,
        email: "",
        buttonText: "Email Sent",
        success: response.data.message,
      });
    } catch (error) {
      console.log("FORGOT PW ERROR", error);
      setState({
        ...state,
        buttonText: "Send Email",
        error: error.response.data.error,
      });
    }
  };

  const passwordForgotForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          onChange={handleChange}
          value={email}
          placeholder="Type your email"
          required
        />
      </div>
      <div>
        <button className="btn btn-outline-dark">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Forgot Password</h1>
          <br />
          {/* If successful show success message */}
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordForgotForm()}
        </div>
      </div>
    </Layout>
  );
};

export default forgotPassword;
