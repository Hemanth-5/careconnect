// src/api/auth.js
import api from "./index";
import { API } from "../constants/api";

const BASE_URL = "http://localhost:5000/api";

export const authAPI = {
  login: (credentials) => api.post(API.USERS.LOGIN, credentials),
  refreshToken: (refreshToken) =>
    api.post(API.USERS.REFRESH_TOKEN, { refreshToken }),
  getUserProfile: () => api.get(API.USERS.ME),
  updateUserProfile: (userData) => api.put(API.USERS.UPDATE_PROFILE, userData),
  changePassword: (passwordData) =>
    api.put(API.USERS.CHANGE_PASSWORD, passwordData),

  // Password reset functionality
  requestPasswordReset: (email) =>
    api.post(API.USERS.REQUEST_PASSWORD_RESET, { email }),

  verifyResetToken: (token) => api.get(API.USERS.VERIFY_RESET_TOKEN(token)),

  resetPassword: (token, newPassword) =>
    api.post(API.USERS.RESET_PASSWORD, { token, newPassword }),
};

export default authAPI;
