import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import { ProductContext } from "../../components/context/globalstate";
import Title from "../../components/title";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { API } from "../../config";
import withAdmin from "../withAdmin";
import { useRouter } from "next/router";

const ProductsManager = () => {
  const { state, dispatch } = useContext(ProductContext);
  const { categories, auth } = state;

  const initialState = {
    name: "",
    price: 0,
    description: "",
    companyCity: "",
    companyUSState: "",
    companyCountry: "",
    inStock: 0,
    bodyLocation: "",
    category: "",
    companyName: "",
    productnumber: 0,
  };
  const [product, setProduct] = useState(initialState);
  const {
    name,
    price,
    description,
    inStock,
    bodyLocation,
    category,
    companyName,
    companyCity,
    companyUSState,
    companyCountry,
    productnumber,
  } = product;

  const [images, setImages] = useState([]);
  const [base64, setURI] = useState([]);
  const [onEdit, setOnEdit] = useState(false);

  const router = useRouter();

  const { id } = router.query;

  const grabMime = (image) => {
    // base64 encoded data doesn't contain commas
    let base64ContentArray = image.split(",");

    // base64 content cannot contain whitespaces but nevertheless skip if there are!
    let mimeType = base64ContentArray[0].match(
      /[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/
    )[0];

    // base64 encoded data - pure
    let base64Data = base64ContentArray[1];
    return mimeType;
  };

  const convertImage = (dataURI, type) => {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab], { type: type });
    return bb;
  };

  useEffect(async () => {
    if (id) {
      setOnEdit(true);
      const response = await axios.get(`${API}/store/${id}`);
      setProduct(response.data);
      setURI(response.data.images);
      let newImage = [];
      response.data.images.forEach((image) => {
        const mime = grabMime(image);
        // console.log(mime);
        const convertedImage = convertImage(image, mime);
        // console.log(convertedImage);
        newImage.push(convertedImage);
        return newImage;
      });
      // console.log(newImage);
      setImages([...newImage]);
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages([]);
      setURI([]);
    }
  }, [id]);

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
      // console.log(image);
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
    // console.log({ newImages, err });
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
    e.preventDefault();
    if (auth.user.role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Authentication is not valid." },
      });
    if (
      !name ||
      !price ||
      !description ||
      !inStock ||
      !bodyLocation ||
      !companyName ||
      !companyCity ||
      !companyUSState ||
      !companyCountry ||
      category === "all" ||
      !productnumber ||
      base64.length === 0
    )
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Please add all the fields." },
      });

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    let response;
    if (onEdit) {
      response = await axios.put(
        `${API}/edit/${id}`,
        { ...product, images: base64 },
        {
          headers: {
            authorization: `Bearer ${auth.token}`,
            contentType: "application/json",
          },
        }
      );
      if (response.error)
        return dispatch({
          type: "NOTIFY",
          payload: { error: response.error },
        });
    } else {
      response = await axios.post(
        `${API}/create`,
        { ...product, images: base64 },
        {
          headers: {
            authorization: `Bearer ${auth.token}`,
            contentType: "application/json",
          },
        }
      );
      if (response.error)
        return dispatch({
          type: "NOTIFY",
          payload: { error: response.error },
        });
    }

    // console.log(response);
    return dispatch({
      type: "NOTIFY",
      payload: { success: response.data.msg },
    });
  };

  const handleMultiple = (e) => {
    handleImageInput(e);
    handleImageChange(e);
  };
  // console.log(product);

  return (
    <div className="products_manager">
      <Head>
        <title>Products Manager</title>
      </Head>
      <Title name="create" title="product"></Title>
      <form
        className="row bg-white p-2"
        style={{ border: "1px solid black" }}
        onSubmit={handleSubmit}
      >
        <div className="col-md-6">
          <label
            htmlFor="name"
            className="text-title text-blue"
            style={{ fontWeight: "bold" }}
          >
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            placeholder="Name"
            className="d-block mb-4 w-100 p-2"
            onChange={handleChangeInput}
          />
          <div className="row my-3">
            <div className="col-sm-4">
              <label
                htmlFor="price"
                className="text-title text-blue"
                style={{ fontWeight: "bold" }}
              >
                Price
              </label>
              <input
                type="number"
                name="price"
                value={price}
                placeholder="Price"
                className="d-block w-100 p-2"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-sm-4">
              <label
                htmlFor="inStock"
                className="text-title text-blue"
                style={{ fontWeight: "bold" }}
              >
                In Stock
              </label>
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
              <label
                htmlFor="productnumber"
                className="text-title text-blue"
                style={{ fontWeight: "bold" }}
              >
                Prod Number
              </label>
              <input
                type="number"
                name="productnumber"
                value={productnumber}
                placeholder="Product Number"
                className="d-block w-100 p-2"
                onChange={handleChangeInput}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-5">
              <label
                htmlFor="companyCity"
                className="text-title text-blue"
                style={{ fontWeight: "bold" }}
              >
                City
              </label>
              <input
                type="text"
                name="companyCity"
                value={companyCity}
                placeholder="City"
                className="d-block w-100 p-2"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-sm-2">
              <label
                htmlFor="companyUSState"
                className="text-title text-blue"
                style={{ fontWeight: "bold" }}
              >
                State
              </label>
              <input
                type="text"
                name="companyUSState"
                value={companyUSState}
                placeholder="State"
                className="d-block w-100 p-2"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-sm-5">
              <label
                htmlFor="companyCountry"
                className="text-title text-blue"
                style={{ fontWeight: "bold" }}
              >
                Country
              </label>
              <input
                type="text"
                name="companyCountry"
                value={companyCountry}
                placeholder="Country"
                className="d-block w-100 p-2"
                onChange={handleChangeInput}
              />
            </div>
          </div>
          <label
            htmlFor="description"
            className="mt-4 text-title text-blue"
            style={{ fontWeight: "bold" }}
          >
            Product Description
          </label>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="4"
            placeholder="Description"
            onChange={handleChangeInput}
            className="d-block mb-4 w-100 p-2"
            value={description}
          />
          <label
            htmlFor="bodyLocation"
            className="text-title text-blue"
            style={{ fontWeight: "bold" }}
          >
            Body Location{" "}
          </label>
          <input
            name="bodyLocation"
            type="text"
            placeholder="Body Location"
            onChange={handleChangeInput}
            className="d-block mb-4 w-100 p-2"
            value={bodyLocation}
          />
          <label
            htmlFor="companyName"
            className="text-title text-blue"
            style={{ fontWeight: "bold" }}
          >
            Company Name{" "}
          </label>
          <input
            name="companyName"
            type="text"
            cols="30"
            placeholder="Company Name"
            onChange={handleChangeInput}
            className="d-block mb-4 w-100 p-2"
            value={companyName}
          />
          <label
            htmlFor="category"
            className="text-title text-blue"
            style={{ fontWeight: "bold" }}
          >
            Product Category
          </label>
          <div className="input-group-prepend px-0 my-2">
            <select
              name="category"
              id="category"
              value={category}
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
          <button
            title="submit"
            className="btn btn-outline-info px-4 my-3 mr-2"
          >
            {onEdit ? "Update" : "Create"}
          </button>
        </div>
        <div className="col-md-6">
          <label
            className="text-title text-blue"
            style={{ fontWeight: "bold" }}
          >
            Image Upload{" "}
          </label>
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
      </form>
    </div>
  );
};
export default withAdmin(ProductsManager);
