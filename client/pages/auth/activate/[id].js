// Dynamic id, only available through next.js the jwt token from auth link in registration email
import { useState, useEffect, useContext } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";
import { API } from "../../../config";
import { withRouter } from "next/router";
import Head from "next/head";
import { ProductContext } from "../../../components/context/globalstate";

const ActivateAccount = ({ router }) => {
  // Create state to store token
  const [state, setState] = useState({
    name: "",
    token: "",
  });

  const { dispatch } = useContext(ProductContext);

  // Destructure state variables
  const { name, token } = state;

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
    // Set loading dispatch
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    // Try catch block for asynchrouse post to API endpoint
    try {
      const response = await axios.post(`${API}/register/activate`, { token });
      //   console.log("account activate response", response);
      setState({
        ...state,
        name: "",
        token: "",
      });
      dispatch({
        type: "NOTIFY",
        payload: { success: response.data.msg },
      });
    } catch (error) {
      //   console.log("account activate error", error);
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

  return (
    <>
      <div>
        <Head>
          <title>Activate Account</title>
        </Head>
      </div>
      <div className="row">
        <div
          className="col-md-6 offset-md-3 bg-white p-5"
          style={{ border: "1px solid black" }}
        >
          <h1>Hello {name}, ready to activate your account?</h1>
          <br />
          <button className="btn btn-black btn-block" onClick={clickSubmit}>
            Activate Account
          </button>
        </div>
      </div>
    </>
  );
};

export default withRouter(ActivateAccount);
