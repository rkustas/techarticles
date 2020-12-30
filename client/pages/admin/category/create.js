import dynamic from "next/dynamic";
import Layout from "../../../components/layout";
import withAdmin from "../../withAdmin";
import axios from "axios";
import Resizer from "react-image-file-resizer";
// Dynamic import, whatever you import will be active in this variable, run in client side env
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { API } from "../../../config";
import { useEffect, useState } from "react";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
// Bring in custom react quill bubble theme css
import "react-quill/dist/quill.bubble.css";

// Function to create a category
const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: "",
    error: "",
    success: "",
    //   Browser API
    // formData: process.browser && new FormData(),
    buttonText: "Create",
    image: "",
  });

  // Need to use the entire event not just the target value for content so created its own state independent of other handleChange values
  const [content, setContent] = useState("");

  // Set new states for imageupload button
  const [imageUploadButtonName, setImageUploadButtonName] = useState(
    "Upload Image"
  );

  const {
    name,
    error,
    success,
    // formData,
    buttonText,
    imageUploadText,
    image,
  } = state;

  const handleChange = (name) => (e) => {
    // //   Handling the changes, setting state upon typing target becomes files when dealing with files
    // // If it is a file, redefined value as files for images
    // const value = name === "image" ? e.target.files[0] : e.target.value;
    // // Get image name
    // const imageName =
    //   name === "image" ? e.target.files[0].name : "Upload Image";
    // //   Set the formdata
    // formData.set(name, value);
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
    });
  };

  // Handle Content
  const handleContent = (e) => {
    // console.log(e);
    setContent(e);
    setState({ ...state, success: "", error: "" });
  };

  // Handle image
  const handleImage = (event) => {
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    setImageUploadButtonName(event.target.files[0].name);
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          // console.log(uri);
          setState({ ...state, image: uri, success: "", error: "" });
        },
        "base64"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({
      ...state,
      buttonText: "Creating",
    });
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
      console.log("CATEGORY CREATE RESPONSE", response);
      // Set buttonText
      setImageUploadButtonName("Upload Image");
      setContent("");
      // Set state upon valid request
      setState({
        ...state,
        name: "",
        content: "",
        formData: "",
        buttonText: "Created",
        imageUploadText: "Upload image",
        success: `${response.data.name} is created`,
      });
    } catch (error) {
      console.log("CATEGORY CREATE ERROR", error);
      setState({
        ...state,
        buttonText: "Create",
        error: error.response.data.error,
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
          required
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
            required
            hidden
          />
        </label>
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
          <h1>Create category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {createCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withAdmin(Create);
