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

/*
Reducer is used to manage state, the return of reducer is the new state value
we can not update the state's value, we replace it
*/

function productListReducer(state = { products: [] }, action) {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [], error: null };

    case PRODUCT_LIST_SUCCESS:
      return { loading: false, products: action.payload, error: null };

    case PRODUCT_LIST_FAILED:
      return { loading: false, products: null, error: action.payload };

    default:
      return state;
  }
}

function productDetailsReducer(state = { product: null }, action) {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true, product: null, error: null };

    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload, error: null };

    case PRODUCT_DETAILS_FAILED:
      return { loading: false, product: null, error: action.error };

    default:
      return state;
  }
}

function productUpdateReducer(state = { product: null }, action) {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true, product: null, error: null };
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, product: action.payload, error: null };
    case PRODUCT_UPDATE_FAILED:
      return { loading: false, product: null, error: action.error };
    default:
      return state;
  }
}

function productCreateReducer(state = { product: null }, action) {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true, product: null, error: null };
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, product: action.payload, error: null };
    case PRODUCT_CREATE_FAILED:
      return { loading: false, product: null, error: action.error };
    default:
      return state;
  }
}

export {
  productListReducer,
  productDetailsReducer,
  productUpdateReducer,
  productCreateReducer,
};
