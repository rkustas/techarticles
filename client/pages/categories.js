import axios from "axios";
import Head from "next/head";
import { useContext, useState } from "react";
import { updateItem } from "../components/context/actions";
import { ProductContext } from "../components/context/globalstate";
import { API } from "../config";
import { getCookieFromBrowser, isAuth } from "../helpers/auth";

const Categories = () => {
  // Context
  const { state, dispatch } = useContext(ProductContext);
  const { categories } = state;
  console.log(categories);

  //   Local state
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const token = getCookieFromBrowser("token");

  const createCategory = async () => {
    if (isAuth().role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Authentication invalid" },
      });
    if (!name)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Name cannot be left blank" },
      });
    dispatch({
      type: "NOTIFY",
      payload: { loading: true },
    });

    let response;

    if (id) {
      response = await axios.put(
        `${API}/productCategories/${id}`,
        { name },
        {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: "application/json",
          },
        }
      );

      if (response.error)
        return dispatch({
          type: "NOTIFY",
          payload: { error: response.error },
        });
      //   console.log(response);
      dispatch(
        updateItem(categories, id, response.data.category, "ADD_CATEGORIES")
      );
    } else {
      response = await axios.post(
        `${API}/productCategory`,
        { name },
        {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: "application/json",
          },
        }
      );

      if (response.error)
        return dispatch({
          type: "NOTIFY",
          payload: { error: response.error },
        });

      dispatch({
        type: "ADD_CATEGORIES",
        payload: [...categories, response.data.newCategory],
      });
    }

    // console.log(response);

    setName("");
    setId("");

    return dispatch({
      type: "NOTIFY",
      payload: { success: response.data.msg },
    });
  };

  const handleEditCategory = (category) => {
    //
    // console.log(category);
    setId(category._id);
    // console.log(id);
    setName(category.name);
  };
  return (
    <div className="col-md-6 mx-auto my-3">
      <Head>
        <title>Product Categories</title>
      </Head>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new category"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-secondary ml-1" onClick={createCategory}>
          {id ? "Update" : "Create"}
        </button>
      </div>
      {categories.map((category) => (
        <div key={category._id} className="card my-2 text-capitalize">
          <div className="card-body d-flex justify-content-between">
            {category.name}
            <div style={{ cursor: "pointer" }}>
              <i
                className="fas fa-edit mr-2 text-info"
                onClick={() => handleEditCategory(category)}
              ></i>
              <i
                className="fas fa-trash-alt text-danger"
                data-toggle="modal"
                data-target="#exampleModal"
                onClick={() =>
                  dispatch({
                    type: "ADD_MODAL",
                    payload: {
                      data: categories,
                      id: category._id,
                      name: category.name,
                      type: "ADD_CATEGORIES",
                    },
                  })
                }
              ></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;
