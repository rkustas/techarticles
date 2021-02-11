import { deleteItem } from "../components/context/actions";
import { useContext } from "react";
import { ProductContext } from "../components/context/globalstate";
import axios from "axios";
import { API } from "../config";
import { useRouter } from "next/router";

const Modal = () => {
  const { state, dispatch } = useContext(ProductContext);
  const { modal, auth } = state;
  // Bringing in token

  const router = useRouter();

  const deleteUser = async (item) => {
    dispatch(deleteItem(item.data, item.id, item.type));
    const response = await axios.delete(`${API}/users/${item.id}`, {
      headers: {
        authorization: `Bearer ${auth.token}`,
        contentType: "application/json",
      },
    });
    // console.log(response);
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

  const deleteCategories = async (item) => {
    try {
      const response = await axios.delete(
        `${API}/productCategories/${item.id}`,
        {
          headers: {
            authorization: `Bearer ${auth.token}`,
            contentType: "application/json",
          },
        }
      );
      // console.log(response);

      dispatch(deleteItem(item.data, item.id, item.type));

      return dispatch({
        type: "NOTIFY",
        payload: { success: response.data.msg },
      });
    } catch (error) {
      // console.log(error.response);
      if (error.response)
        return dispatch({
          type: "NOTIFY",
          payload: { error: error.response.data },
        });
    }
  };

  const deleteProduct = async (item) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const response = await axios.delete(`${API}/store/${item.id}`, {
      headers: {
        authorization: `Bearer ${auth.token}`,
        contentType: "application/json",
      },
    });
    // console.log(response);
    if (response.error)
      return dispatch({
        type: "NOTIFY",
        payload: { error: response.error },
      });

    dispatch({
      type: "NOTIFY",
      payload: { success: response.data.msg },
    });
    return router.push("/");
  };

  const deleteCartItem = (item) => {
    dispatch(deleteItem(item.data, item.id, item.type));
    dispatch({ type: "NOTIFY", payload: "Item removed from cart!" });
  };

  const linkCategory = async (item) => {
    try {
      dispatch(deleteItem(item.data, item.id, item.type));
      const response = await axios.delete(`${API}/category/${item.slug}`, {
        // Only authorized user can delete
        headers: {
          Authorization: `Bearer ${auth.token}`,
          contentType: "application/json",
        },
      });
      // console.log(response);

      return dispatch({
        type: "NOTIFY",
        payload: { success: response.data.msg },
      });
    } catch (error) {
      // console.log(error.response);
      if (error.response)
        return dispatch({
          type: "NOTIFY",
          payload: { error: error.response.data },
        });
    }
  };

  const handleSubmit = () => {
    if (modal.length !== 0) {
      for (const item of modal) {
        if (item.type === "ADD_CART") deleteCartItem(item);
        if (item.type === "ADD_USERS") deleteUser(item);
        if (item.type === "ADD_CATEGORIES") deleteCategories(item);
        if (item.type === "DELETE_PRODUCT") deleteProduct(item);
        if (item.type === "ADD_ARTICLE_CAT") linkCategory(item);
        dispatch({ type: "ADD_MODAL", payload: [] });
      }
    }
  };
  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-capitalize" id="exampleModalLabel">
              {modal.length !== 0 && modal[0].name}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">Do you want to delete this item?</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={handleSubmit}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
