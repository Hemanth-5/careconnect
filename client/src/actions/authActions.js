// src/actions/authActions.js
import authAPI from "../api/auth";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REFRESH_TOKEN_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAIL,
  LOGOUT,
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
  CHANGE_PASSWORD,
} from "../constants/actionTypes";

// Login action
export const login = (email, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("userType", data.userType);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: data.token,
        refreshToken: data.refreshToken,
        user: data.user,
        userType: data.userType,
      },
    });

    return data;
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    throw error;
  }
};

// Refresh token action
export const refreshToken = () => async (dispatch) => {
  dispatch({ type: REFRESH_TOKEN_REQUEST });

  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const { data } = await authAPI.refreshToken(refreshToken);
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);

    dispatch({
      type: REFRESH_TOKEN_SUCCESS,
      payload: {
        token: data.token,
        refreshToken: data.refreshToken,
      },
    });

    return data;
  } catch (error) {
    dispatch({
      type: REFRESH_TOKEN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    // If refresh token fails, log the user out
    dispatch(logout());
    throw error;
  }
};

// Logout action
export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userType");

  dispatch({ type: LOGOUT });
};

// Get user profile action
export const getUserProfile = () => async (dispatch) => {
  try {
    const { data } = await authAPI.getUserProfile();

    dispatch({
      type: GET_USER_PROFILE,
      payload: data,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

// Update user profile action
export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    const { data } = await authAPI.updateUserProfile(userData);

    dispatch({
      type: UPDATE_USER_PROFILE,
      payload: data,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

// Change password action
export const changePassword = (passwordData) => async (dispatch) => {
  try {
    const { data } = await authAPI.changePassword(passwordData);

    dispatch({
      type: CHANGE_PASSWORD,
      payload: data,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
