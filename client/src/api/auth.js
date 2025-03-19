// src/api/auth.js
import api from "./index";
import { API } from "../constants/api";

export const authAPI = {
  login: (credentials) => api.post(API.USERS.LOGIN, credentials),
  refreshToken: (refreshToken) =>
    api.post(API.USERS.REFRESH_TOKEN, { refreshToken }),
  getUserProfile: () => api.get(API.USERS.ME),
  updateUserProfile: (userData) => api.put(API.USERS.UPDATE_PROFILE, userData),
  changePassword: (passwordData) =>
    api.put(API.USERS.CHANGE_PASSWORD, passwordData),
};

export default authAPI;
