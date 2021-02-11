// All Imports
import { useState, useEffect, useContext } from "react";
var React = require("react");
import axios from "axios";
import { API } from "../../../config";
import { getCookie } from "../../../helpers/auth";
import Head from "next/head";
import { ProductContext } from "../../../components/context/globalstate";

// Received token props from getInitalProps function down below
const Create = ({ token }) => {
  // Create state
  const [link, setLink] = useState({
    title: "",
    url: "",
    categories: [],
    loadedCategories: [],
    type: "",
    medium: "",
  });

  const { state, dispatch } = useContext(ProductContext);
  const { auth } = state;

  const { title, url, categories, loadedCategories, type, medium } = link;

  // Load categories when component mounts, run whenever success
  useEffect(() => {
    loadCategories();
  }, [categories]);

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setLink({ ...link, loadedCategories: response.data });
    } catch (error) {
      if (error.response) {
        return dispatch({
          type: "NOTIFY",
          payload: { error: error.response.data },
        });
      }
    }
  };

  const handleTitleChange = (e) => {
    setLink({ ...link, title: e.target.value });
  };

  const handleURLChange = (e) => {
    setLink({ ...link, url: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    // console.table({ title, url, categories, type, medium });
    try {
      const response = await axios.post(
        `${API}/link`,
        { title, url, categories, type, medium },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLink({
        ...link,
        title: "",
        url: "",
        loadedCategories: [],
        categories: [],
        type: "",
        medium: "",
      });
      dispatch({
        type: "NOTIFY",
        payload: { success: response.data.msg },
      });
    } catch (error) {
      // console.log("LINK SUBMIT ERROR", error);
      setLink({ ...link });
      if (error.response)
        return dispatch({
          type: "NOTIFY",
          payload: { error: error.response.data.error },
        });
    }
  };

  const handleMediumClick = (e) => {
    setLink({ ...link, medium: e.target.value });
  };

  const handleTypeClick = (e) => {
    setLink({ ...link, type: e.target.value });
  };

  const showMedium = () => (
    <React.Fragment>
      <div className="form-check ml-3">
        <label className="form-check-label">
          {/* If handleTypeClick returns video then video will be checked */}
          <input
            type="radio"
            onChange={handleMediumClick}
            checked={medium === "video"}
            value="video"
            className="form-check-input"
            name="medium"
          />{" "}
          Video
        </label>
      </div>
      <div className="form-check ml-3">
        <label className="form-check-label">
          {/* If handleTypeClick returns book then book will be checked*/}
          <input
            type="radio"
            onChange={handleMediumClick}
            checked={medium === "book"}
            value="book"
            className="form-check-input"
            name="medium"
          />{" "}
          Book
        </label>
      </div>
      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onChange={handleMediumClick}
            checked={medium === "blog post"}
            value="blog post"
            className="form-check-input"
            name="medium"
          />{" "}
          Blog Post
        </label>
      </div>
      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onChange={handleMediumClick}
            checked={medium === "article"}
            value="article"
            className="form-check-input"
            name="medium"
          />{" "}
          Article
        </label>
      </div>
    </React.Fragment>
  );

  const showTypes = () => (
    <React.Fragment>
      <div className="form-check ml-3">
        <label className="form-check-label">
          {/* If handleTypeClick returns free then free will be checked */}
          <input
            type="radio"
            onChange={handleTypeClick}
            checked={type === "free"}
            value="free"
            className="form-check-input"
            name="type"
          />{" "}
          Free
        </label>
      </div>
      <div className="form-check ml-3">
        <label className="form-check-label">
          {/* If handleTypeClick returns paid then paid will be checked*/}
          <input
            type="radio"
            onChange={handleTypeClick}
            checked={type === "paid"}
            value="paid"
            className="form-check-input"
            name="type"
          />{" "}
          Paid
        </label>
      </div>
    </React.Fragment>
  );

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
    setLink({ ...link, categories: all });
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

  //   Create a form
  const submitLinkForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          type="text"
          className="form-control"
          onChange={handleTitleChange}
          value={title}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">URL</label>
        <input
          type="url"
          className="form-control"
          onChange={handleURLChange}
          value={url}
        />
      </div>
      <div className="text-center">
        <button
          disabled={!token}
          className="btn btn-outline-dark btn-block"
          type="submit"
        >
          {auth.user || token ? "Post" : "Login to post"}
        </button>
      </div>
    </form>
  );

  return (
    <>
      <div>
        <Head>
          <title>Create Link</title>
        </Head>
      </div>
      <div className="bg-white p-5" style={{ border: "1px solid black" }}>
        <div className="row">
          <div className="col-md-12">
            <h1>Submit a Link/URL</h1>
            <br />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="form-check">
              <label className="text-muted ml-4">Category</label>
              <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
                {showCategories()}
              </ul>
            </div>
            <div className="form-group">
              <label className="text-muted ml-4">Type</label>
              <hr />
              {showTypes()}
            </div>
            <div className="form-group">
              <label className="text-muted ml-4">Medium</label>
              <hr />
              {showMedium()}
            </div>
          </div>
          <div className="col-md-8">{submitLinkForm()}</div>
        </div>
      </div>
    </>
  );
};

// Use getInitalProps to get the cookie information and token
Create.getInitialProps = ({ req }) => {
  const token = getCookie("token", req);
  return { token };
};

export default Create;
