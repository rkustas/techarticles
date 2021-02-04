import Head from "next/head";
import { useContext, useState } from "react";
import { ProductContext } from "../components/context/globalstate";
import { isAuth } from "../helpers/auth";
import Resizer from "react-image-file-resizer";
import axios from "axios";

const ProductsManager = () => {
  const { state, dispatch } = useContext(ProductContext);
  const { categories } = state;

  const initialState = {
    product_id: "",
    Name: "",
    Price: 0,
    inStock: 0,
    BodyLocation: "",
    Category: "",
    CompanyName: "",
    id: 0,
  };
  const [product, setProduct] = useState(initialState);
  const {
    product_id,
    Name,
    Price,
    inStock,
    BodyLocation,
    Category,
    CompanyName,
    productnumber,
  } = product;

  const [images, setImages] = useState([]);
  const [base64, setURI] = useState([]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const handleImageChange = (e) => {
    let newImagesBase64 = [];
    let numeric = 0;

    const files = [...e.target.files];
    files.forEach(async (file) => {
      const image = await resizeFile(file);
      console.log(image);
      numeric += 1;
      if (numeric <= 5) newImagesBase64.push(image);
      //   console.log(newImagesBase64);
      return newImagesBase64, setURI([...base64, ...newImagesBase64]);
    });
  };

  const handleImageInput = (e) => {
    dispatch({ type: "NOTIFY", payload: {} });
    let newImages = [];
    let num = 0;
    let err = "";
    const files = [...e.target.files];
    // console.log(files);

    if (files.length === 0)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "There are not any files." },
      });
    files.forEach((file) => {
      if (file.size > 1024 * 1024)
        return (err = "The largest image size is 1mb");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return (err = "Image format is incorrect.");

      num += 1;
      if (num <= 5) newImages.push(file);
      return newImages;
    });
    // console.log(images);
    console.log({ newImages, err });
    if (err)
      dispatch({
        type: "NOTIFY",
        payload: { error: err },
      });

    const imgCount = images.length;
    if (imgCount + newImages.length > 5)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Select up to 5 images." },
      });
    setImages([...images, ...newImages]);
  };

  const DeleteImage = (index) => {
    const newArr = [...images];
    const newbase64 = [...base64];
    newArr.splice(index, 1);
    newbase64.splice(index, 1);
    setImages(newArr);
    setURI(newbase64);
  };

  const handleSubmit = async (e) => {
    e.preventdefault();
    if (isAuth().role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Authentication is not valid." },
      });
    if (
      !Name ||
      !Price ||
      !inStock ||
      !BodyLocation ||
      !CompanyName ||
      category === "all" ||
      !productnumber ||
      base64.length === 0
    )
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Please add all the fields." },
      });

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    const response = await axios.post(
      `/store/create`,
      { ...product, base64: [...BodyLocationbase64] },
      {
        headers: {
          authorization: `Bearer ${token}`,
          contentType: "application/json",
        },
      }
    );
    console.log(response);
    if (response.error)
      return dispatch({
        type: "NOTIFY",
        payload: { error: response.error },
      });
    return dispatch({
      type: "NOTIFY",
      payload: { success: response.data.msg },
    });
  };

  const handleMultiple = (e) => {
    handleImageInput(e);
    handleImageChange(e);
  };

  return (
    <div className="products_manager">
      <Head>
        <title>Products Manager</title>
      </Head>
      <form
        className="row bg-white p-2"
        style={{ border: "1px solid black" }}
        onSubmit={handleSubmit}
      >
        <div className="col-md-6">
          <input
            type="text"
            name="product_id"
            value={product_id}
            placeholder="ID"
            className="d-block my-4 w-100 p-2"
            onChange={handleChangeInput}
          />
          <input
            type="text"
            name="Name"
            value={Name}
            placeholder="Name"
            className="d-block my-4 w-100 p-2"
            onChange={handleChangeInput}
          />
          <div className="row">
            <div className="col-sm-4">
              <label htmlFor="Price">Price</label>
              <input
                type="number"
                name="Price"
                value={Price}
                placeholder="Price"
                className="d-block w-100 p-2"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-sm-4">
              <label htmlFor="inStock">In Stock</label>
              <input
                type="number"
                name="inStock"
                value={inStock}
                placeholder="In Stock"
                className="d-block w-100 p-2"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-sm-4">
              <label htmlFor="productnumber">Product Number</label>
              <input
                type="number"
                name="productnumber"
                value={productnumber}
                placeholder="productnumber"
                className="d-block w-100 p-2"
                onChange={handleChangeInput}
              />
            </div>
          </div>
          <textarea
            name="BodyLocation"
            id="BodyLocation"
            cols="30"
            rows="4"
            placeholder="Body Location"
            onChange={handleChangeInput}
            className="d-block my-4 w-100 p-2"
            value={BodyLocation}
          />
          <textarea
            name="CompanyName"
            id="CompanyName"
            cols="30"
            rows="6"
            placeholder="Company Name"
            onChange={handleChangeInput}
            className="d-block my-4 w-100 p-2"
            value={CompanyName}
          />
          <div className="input-group-prepend px-0 my-2">
            <select
              name="Category"
              id="Category"
              value={Category}
              onChange={handleChangeInput}
              className="custom-select text-capitalize"
            >
              <option value="all">All Products</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6 my-4">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Upload</span>
            </div>

            <div className="custom-file border rounded">
              <input
                type="file"
                className="custom-file-input"
                onChange={handleMultiple}
                multiple
                accept="image/*"
              />
            </div>
          </div>

          <div className="row img-up">
            {images.map((img, index) => (
              <div key={index} className="file_img my-1">
                <img
                  src={img.url ? img.url : URL.createObjectURL(img)}
                  alt=""
                  className="img-thumbnail rounded"
                />
                <span onClick={() => DeleteImage(index)}>X</span>
              </div>
            ))}
          </div>
        </div>
        <button
          title="submit"
          className="btn btn-outline-info btn-block px-4 mb-3"
        >
          Create
        </button>
      </form>
    </div>
  );
};
export default ProductsManager;
