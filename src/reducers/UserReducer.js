import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILED,
  USER_LOGOUT,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAILED,
} from "../constants/UserConstans";

export default function UserReducer(state = { user: {} }, action) {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true, user: null, error: null };

    case USER_LOGIN_SUCCESS:
      return { loading: false, user: action.payload, error: null };

    case USER_LOGIN_FAILED:
      return { loading: false, user: null, error: action.error };

    case USER_LOGOUT:
      return { loading: false, user: null, error: null };

    case USER_UPDATE_SUCCESS:
      return { loading: false, user: action.payload, error: null };

    case USER_UPDATE_FAILED:
      return { loading: false, user: null, error: action.error };

    default:
      return state;
  }
}
