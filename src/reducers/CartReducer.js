import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_ADD_SHIPPING_ADDRESS,
  CART_ADD_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
} from "../constants/CartConstans";

export default function CartReducer(
  state = { cartItems: [], shippingAddress: {} },
  action
) {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      let existItem = null;
      if (state.cartItems) {
        existItem = state.cartItems.find((x) => x.product === item.product);
      }

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, item] };
      }
    case CART_REMOVE_ITEM:
      let filteredCart = state.cartItems.filter(
        (cartItem) => cartItem.product !== action.payload
      );
      return {
        ...state,
        cartItems: filteredCart,
      };
    case CART_ADD_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case CART_ADD_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case CART_CLEAR_ITEMS:
      return {
        ...state,
        cartItems: [],
      };
    default:
      return state;
  }
}
