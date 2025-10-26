/*
Redux is a state management library for JavaScript apps (often used with React). It centralizes app state in a single “store,” so data flows in a predictable, testable way.

Core ideas (the 3 rules)

Single source of truth: One store holds your whole app state (usually a plain object).

State is read-only: You never mutate state directly—only dispatch actions (plain objects) that describe what happened.

Changes via pure functions: Reducers are pure functions (state, action) -> newState that compute the next state immutably.
*/

import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import {
  productListReducer,
  productDetailsReducer,
} from "./reducers/ProductReducer";
import CartReducer from "./reducers/CartReducer";
import UserReducer from "./reducers/UserReducer";
import { orderCreateReducer, orderListReducer } from "./reducers/orderReducers";

// combineReducers is a function provided by Redux that allows you to combine multiple reducers into a single root reducer. Each reducer will manage its own slice of the state.
// When you use combineReducers, it automatically merges all your slice reducers into one object. The result is the global state of your app.
const reducer = combineReducers({
  productList: productListReducer, // Associate the reducer with the "productList" state
  productDetails: productDetailsReducer,
  cart: CartReducer,
  user: UserReducer,
  orderCreate: orderCreateReducer,
  orderList: orderListReducer,
});

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : {};

const cartShippingAddress = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const cartPaymentMethod = localStorage.getItem("paymentMethod")
  ? localStorage.getItem("paymentMethod")
  : null;

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: cartShippingAddress,
    paymentMethod: cartPaymentMethod,
  },
  user: userFromStorage,
  orderCreate: {},
};

const middleWare = [thunk];

/*
createStore(reducer, preloadedState, enhancer)

reducer: the root reducer (currently empty).

initialState: preloaded state (empty object).

enhancer: here it’s DevTools wrapping applyMiddleware(thunk).

Result: a store that supports async actions and is visible in Redux DevTools.
*/
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleWare))
);

export default store;
