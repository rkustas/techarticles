// Dynamic id, only available through next.js the jwt token from auth link in registration email
import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { API } from "../../../config";
import { withRouter } from "next/router";
import Layout from "../../../components/Layout";

const ActivateAccount = ({ router }) => {
  // Create state to store token
  const [state, setState] = useState({
    name: "",
    token: "",
    buttonText: "Activate Account",
    success: "",
    error: "",
  });
  // Destructure state variables
  const { name, token, buttonText, success, error } = state;

  //   Grab the token from router so we can decode it and the username will be available, second parameter is a dependency and will run when router changes
  useEffect(() => {
    let token = router.query.id;
    if (token) {
      // Decode token and grab the name only
      const { name } = jwt.decode(token);
      setState({ ...state, name, token });
    }
  }, [router]);

  //   Button to send token to backend to for creating user
  const clickSubmit = async (e) => {
    e.preventDefault();
    // console.log("activate account");
    // Set button text state
    setState({ ...state, buttonText: "Activating" });

    // Try catch block for asynchrouse post to API endpoint
    try {
      const response = await axios.post(`${API}/register/activate`, { token });
      //   console.log("account activate response", response);
      setState({
        ...state,
        name: "",
        token: "",
        buttonText: "Activated",
        success: response.data.message,
      });
    } catch (error) {
      //   console.log("account activate error", error);
      setState({
        ...state,
        buttonText: "Activate Account",
        error: error.response.data.error,
      });
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Hello {name}, ready to activate your account?</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          <button
            className="btn btn-outline-black btn-block"
            onClick={clickSubmit}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
