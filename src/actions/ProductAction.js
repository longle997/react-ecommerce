import {
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_FAILED,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAILED,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAILED,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAILED,
} from "../constants/ProductConstant";
import axios from "axios";

/*
    This is a Redux action creator that returns a function (instead of a plain action object) to handle asynchronous behavior. This is possible due to Redux Thunk middleware.
    The function is asynchronous, meaning it will handle the fetching of data asynchronously and dispatch actions based on the result.
    listProducts is an arrow function that return an async arrow function with param dispatch
    Flow Summary
    Component triggers listProducts() via Redux dispatch.
    The PRODUCT_LIST_REQUEST action is dispatched, setting loading state.
    axios.get fetches data from the API.
    On success, the PRODUCT_LIST_SUCCESS action is dispatched with the data.
    On failure, the PRODUCT_LIST_FAILED action is dispatched with the error message.
    The UI reacts based on the Redux state (loading, error, products).
    By having unique action types (like PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAILED), you ensure that different parts of your application (via different reducers) can listen for and respond to specific events in the app.
*/
export const listProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_LIST_REQUEST,
    });

    const { data } = await axios.get("/api/products");

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data.results,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const detailsProduct = (productID) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_DETAILS_REQUEST,
    });
    const { data } = await axios.get(`/api/products/${productID}`);
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAILED,
      error: error,
    });
  }
};

export const updateProduct =
  (productID, updated, config) => async (dispatch) => {
    try {
      dispatch({
        type: PRODUCT_UPDATE_REQUEST,
      });
      const { data } = await axios.put(
        `/api/products/${productID}/`,
        updated,
        config
      );
      dispatch({
        type: PRODUCT_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_UPDATE_FAILED,
        error: error,
      });
    }
  };

export const createProduct = (product, config) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    });
    const { data } = await axios.post(`/api/products/`, product, config);
    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAILED,
      error: error,
    });
  }
};
