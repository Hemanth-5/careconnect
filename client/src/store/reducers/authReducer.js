// src/store/reducers/authReducer.js
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
} from "../../constants/actionTypes";

const initialState = {
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  userType: localStorage.getItem("userType"),
  isAuthenticated: !!localStorage.getItem("token"),
  user: null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REFRESH_TOKEN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        user: action.payload.user,
        userType: action.payload.userType,
        error: null,
      };

    case REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        error: null,
      };

    case LOGIN_FAIL:
    case REFRESH_TOKEN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case LOGOUT:
      return {
        ...initialState,
        token: null,
        refreshToken: null,
        userType: null,
        isAuthenticated: false,
        user: null,
      };

    case GET_USER_PROFILE:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };

    case UPDATE_USER_PROFILE:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default authReducer;
