import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILED,
  USER_LOGOUT,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAILED,
} from "../constants/UserConstans";

export const userLogin = (email, password) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });
    const { data } = await axios.post(
      "https://vercel-django-eosin.vercel.app/api/users/login/",
      {
        username: email,
        password: password,
      }
    );
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem("user", JSON.stringify(getState().user));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAILED,
      error:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const userLogout = () => async (dispatch) => {
  dispatch({
    type: USER_LOGOUT,
  });
  localStorage.setItem("user", JSON.stringify({}));
};

export const userUpdateInfo =
  (name, email, password) => async (dispatch, getState) => {
    try {
      const { user } = getState().user;
      // the header config only available if the user.access is valid
      const { data } = await axios.put(
        "https://vercel-django-eosin.vercel.app/api/users/profile/update/",
        {
          name: name,
          email: email,
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      dispatch({
        type: USER_UPDATE_SUCCESS,
        payload: data,
      });
      localStorage.setItem("user", JSON.stringify(getState().user));
    } catch (error) {
      dispatch({
        type: USER_UPDATE_FAILED,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };
