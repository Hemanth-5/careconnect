import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

const API_URL =
  process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:5000/api";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const userAPI = {
  // Get current user profile
  getUserProfile: async () => {
    try {
      // Should match router.get("/me", authMiddleware, getUserDetails)
      const response = await api.get("/users/me");
      return response; // Return the whole response object
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userData) => {
    try {
      // Should match router.put("/me", authMiddleware, updateUserProfile)
      const response = await api.put("/users/me", userData);
      return response;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Update profile picture
  updateProfilePicture: async (formData) => {
    try {
      // Should match router.put("/profile-picture", authMiddleware, ...)
      const response = await api.put("/users/profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      // Should match router.put("/me/password", authMiddleware, changePassword)
      const response = await api.put("/users/me/password", passwordData);
      return response;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  // Register user
  registerUser: async (userData) => {
    try {
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  // Login user
  loginUser: async (credentials) => {
    try {
      const response = await api.post("/users/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post("/users/refresh-token", { refreshToken });
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  },
};

export default userAPI;
