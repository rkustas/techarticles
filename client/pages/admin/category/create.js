import dynamic from "next/dynamic";
import Layout from "../../../components/layout";
import withAdmin from "../../withAdmin";
import axios from "axios";
import Resizer from "react-image-file-resizer";
// Dynamic import, whatever you import will be active in this variable, run in client side env
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { API } from "../../../config";
import { useContext, useEffect, useState } from "react";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
// Bring in custom react quill bubble theme css
import "react-quill/dist/quill.bubble.css";
import Head from "next/head";
import { ProductContext } from "../../../components/context/globalstate";

// Function to create a category
const Create = ({ user, token }) => {
  const [category, setCategory] = useState({
    name: "",
    image: "",
  });

  // Bring in context state for loading
  const { state, dispatch } = useContext(ProductContext);
  const { artCategories } = state;
  // console.log(artCategories);

  // Need to use the entire event not just the target value for content so created its own state independent of other handleChange values
  const [content, setContent] = useState("");

  // Set new states for imageupload button
  const [imageUploadButtonName, setImageUploadButtonName] = useState(
    "Upload Image"
  );

  const { name, imageUploadText, image } = category;

  const handleChange = (name) => (e) => {
    // //   Handling the changes, setting state upon typing target becomes files when dealing with files
    // // If it is a file, redefined value as files for images
    // const value = name === "image" ? e.target.files[0] : e.target.value;
    // // Get image name
    // const imageName =
    //   name === "image" ? e.target.files[0].name : "Upload Image";
    // //   Set the formdata
    // formData.set(name, value);
    setCategory({
      ...category,
      [name]: e.target.value,
    });
  };

  // Handle Content
  const handleContent = (e) => {
    // console.log(e);
    setContent(e);
  };

  // Handle image
  const handleImage = (event) => {
    let file = event.target.files[0];
    if (!file) {
      return dispatch({
        type: "NOTIFY",
        payload: { error: "File does not exist." },
      });
    }
    setImageUploadButtonName(file.name);
    Resizer.imageFileResizer(
      event.target.files[0],
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        // console.log(uri);
        setCategory({ ...category, image: uri });
      },
      "base64"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    // console.table({ name, content, image });
    // Request with token to category
    try {
      const response = await axios.post(
        `${API}/category`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("CATEGORY CREATE RESPONSE", response);
      // Set buttonText
      setImageUploadButtonName("Upload Image");
      setContent("");
      // Set state upon valid request
      setCategory({
        ...category,
        name: "",
        content: "",
        imageUploadText: "Upload image",
      });
      dispatch({
        type: "ADD_ARTICLE_CAT",
        payload: [...artCategories, response.data.success],
      });

      return dispatch({
        type: "NOTIFY",
        payload: { success: response.data.msg },
      });
    } catch (error) {
      // console.log("CATEGORY CREATE ERROR", error);
      setCategory({ ...category });
      if (error.response)
        return dispatch({
          type: "NOTIFY",
          payload: { error: error.response.data.error },
        });
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          value={name}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Content</label>
        {/* <textarea
          onChange={handleChange("content")}
          value={content}
          className="form-control"
          required
        /> */}
        <ReactQuill
          value={content}
          onChange={handleContent}
          placeholder="Write a comment..."
          theme="bubble"
          className="pb-5 mb-3"
          style={{ border: "1px solid #666" }}
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadButtonName}
          <input
            onChange={handleImage}
            type="file"
            // Accept images from all types, png, jpeg, etv
            accept="image/*"
            className="form-control"
            hidden
          />
        </label>
      </div>
      <div>
        <button className="btn btn-outline-dark btn-block">Create</button>
      </div>
    </form>
  );

  return (
    <>
      <div>
        <Head>
          <title>Create Category</title>
        </Head>
      </div>
      <div className="row bg-white p-5" style={{ border: "1px solid black" }}>
        <div className="col-md-6 offset-md-3">
          <h1>Create category</h1>
          <br />
          {createCategoryForm()}
        </div>
      </div>
    </>
  );
};

export default withAdmin(Create);
