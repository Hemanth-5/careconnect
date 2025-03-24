import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { API } from "../constants/api";

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.get(API.USERS.ME, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(response.data);
        } catch (error) {
          console.error("Authentication error:", error);

          // Handle token expiration
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userType");
          }

          setError("Authentication failed. Please log in again.");
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(API.USERS.LOGIN, credentials);

      // Save token and user type to local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userType", response.data.user.role);

      setUser(response.data.user);

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await axios.put(API.USERS.UPDATE_PROFILE, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error("Profile update error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await axios.put(
        API.USERS.CHANGE_PASSWORD,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Password change error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to change password. Please try again."
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(API.USERS.REQUEST_PASSWORD_RESET, {
        email,
      });

      return response.data;
    } catch (error) {
      console.error("Password reset request error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to request password reset. Please try again."
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(API.USERS.RESET_PASSWORD, {
        token,
        newPassword,
      });

      return response.data;
    } catch (error) {
      console.error("Password reset error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Auth context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
