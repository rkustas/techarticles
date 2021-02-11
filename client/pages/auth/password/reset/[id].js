import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API } from "../../../../config";
import { withRouter } from "next/router";
import jwt from "jsonwebtoken";
import Head from "next/head";
import { ProductContext } from "../../../../components/context/globalstate";

const ResetPassword = ({ router }) => {
  // Create state to store token
  const [state, setState] = useState({
    name: "",
    token: "",
    newPassword: "",
  });

  const { dispatch } = useContext(ProductContext);

  // Destructure state variables
  const { name, token, newPassword } = state;

  useEffect(() => {
    // console.log(router);
    //   Since we name our page id, the token id is already available to us
    const decoded = jwt.decode(router.query.id);
    if (decoded) {
      setState({
        ...state,
        name: decoded.name,
        token: router.query.id,
      });
    }
  }, [router]);

  const handleChange = (e) => {
    setState({ ...state, newPassword: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Post email to", email);
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    try {
      const response = await axios.put(`${API}/reset-password`, {
        resetPasswordLink: token,
        newPassword,
      });
      dispatch({
        type: "NOTIFY",
        payload: { success: response.data.msg },
      });
      //   console.log("FORGOT PASSWORD", response);
      setState({
        ...state,
        newPassword: "",
      });
    } catch (error) {
      // console.log("RESET PW ERROR", error);
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

  const passwordResetForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          onChange={handleChange}
          value={newPassword}
          placeholder="Type your new password"
          required
        />
      </div>
      <div>
        <button className="btn btn-dark btn-block">Reset Password</button>
      </div>
    </form>
  );

  return (
    <>
      <div>
        <Head>
          <title>Password Reset</title>
        </Head>
      </div>
      <div className="row">
        <div
          className="col-md-6 offset-md-3 bg-white p-5"
          style={{ border: "1px solid black" }}
        >
          <h1>Hi {name}, please reset your password</h1>
          <br />
          {/* If successful show success message */}
          {passwordResetForm()}
        </div>
      </div>
    </>
  );
};

export default withRouter(ResetPassword);
