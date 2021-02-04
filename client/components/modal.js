import { deleteItem } from "../components/context/actions";
import { useContext } from "react";
import { ProductContext } from "../components/context/globalstate";
import axios from "axios";
import { API } from "../config";
import { getCookieFromBrowser } from "../helpers/auth";

const Modal = () => {
  const { state, dispatch } = useContext(ProductContext);
  const { modal } = state;
  // Bringing in token
  const token = getCookieFromBrowser("token");
  const handleSubmit = async () => {
    // if (modal.type === "ADD_USERS") {
    //   const response = await axios.delete(`${API}/users/${modal.id}`, {
    //     headers: {
    //       authorization: `Bearer ${token}`,
    //       contentType: "application/json",
    //     },
    //   });
    //   // console.log(response);
    //   if (response.error)
    //     return dispatch({ type: "NOTIFY", payload: { error: response.error } });
    //   return dispatch({
    //     type: "NOTIFY",
    //     payload: { success: response.data.msg },
    //   });
    // }
    // if (modal.type === "ADD_CATEGORIES") {
    //   const response = await axios.delete(
    //     `${API}/productCategories/${modal.id}`,
    //     {
    //       headers: {
    //         authorization: `Bearer ${token}`,
    //         contentType: "application/json",
    //       },
    //     }
    //   );
    //   // console.log(response);
    //   if (response.error)
    //     return dispatch({ type: "NOTIFY", payload: { error: response.error } });
    //   return dispatch({
    //     type: "NOTIFY",
    //     payload: { success: response.data.msg },
    //   });
    // }
    dispatch(deleteItem(modal.data, modal.id, modal.type));
    dispatch({ type: "ADD_MODAL", payload: {} });
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
              {modal.name}
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
              Cancel{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
