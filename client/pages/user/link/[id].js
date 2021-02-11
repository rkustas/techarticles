// All Imports
import { useState, useEffect, useContext } from "react";
import Layout from "../../../components/layout";
var React = require("react");
import axios from "axios";
import withUser from "../../withUser";
import { API } from "../../../config";
import { getCookie, isAuth } from "../../../helpers/auth";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import Head from "next/head";
import { ProductContext } from "../../../components/context/globalstate";

// Received token props from getInitalProps function down below
const Update = ({ oldLink }) => {
  // Create state
  const [updateLink, setUpdateLink] = useState({
    title: oldLink.title,
    url: oldLink.url,
    categories: oldLink.categories,
    loadedCategories: [],
    type: oldLink.type,
    medium: oldLink.medium,
  });

  const { state, dispatch } = useContext(ProductContext);
  const { auth } = state;

  const { title, url, categories, loadedCategories, type, medium } = updateLink;

  // Load categories when component mounts, run whenever success
  useEffect(() => {
    loadCategories();
  }, [categories]);

  // Load categories
  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setUpdateLink({ ...updateLink, loadedCategories: response.data });
  };

  const handleTitleChange = (e) => {
    setUpdateLink({ ...updateLink, title: e.target.value });
  };

  const handleURLChange = (e) => {
    setUpdateLink({ ...updateLink, url: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    // console.table({ title, url, categories, type, medium });
    // Update Link based on logged in user role
    let dynamicUpdateUrl;
    if (auth.user && auth.user.role === "admin") {
      dynamicUpdateUrl = `${API}/link/admin/${oldLink._id}`;
    } else {
      dynamicUpdateUrl = `${API}/link/${oldLink._id}`;
    }
    try {
      const response = await axios.put(
        dynamicUpdateUrl,
        { title, url, categories, type, medium },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return dispatch({
        type: "NOTIFY",
        payload: { success: response.data.msg },
      });
    } catch (error) {
      // console.log("LINK Update ERROR", error);
      if (error.response)
        return dispatch({
          type: "NOTIFY",
          payload: { error: error.response.data.error },
        });
    }
  };

  const handleMediumClick = (e) => {
    setUpdateLink({
      ...updateLink,
      medium: e.target.value,
      success: "",
      error: "",
    });
  };

  const handleTypeClick = (e) => {
    setUpdateLink({
      ...updateLink,
      type: e.target.value,
      success: "",
      error: "",
    });
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
    setUpdateLink({ ...updateLink, categories: all });
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
            // If links categories include
            checked={categories.includes(c._id)}
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
      <div>
        <button
          disabled={!auth.token}
          className="btn btn-outline-dark btn-block"
          type="submit"
        >
          {auth.user || auth.token ? "Update" : "Login to update"}
        </button>
      </div>
    </form>
  );

  return (
    <>
      <div className={"bg-white p-5"} style={{ border: "1px solid black" }}>
        <Head>
          <title>Link Detail</title>
        </Head>
        <div className="row">
          <div className="col-md-12">
            <h1>Update a Link/URL</h1>
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
Update.getInitialProps = async ({ req, query }) => {
  const response = await axios.get(`${API}/link/${query.id}`);

  //   Category in response now
  return { oldLink: response.data };
};

export default withUser(Update);
