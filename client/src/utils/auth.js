// src/utils/auth.js

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Get current user type
export const getUserType = () => {
  return localStorage.getItem("userType");
};

// Check if user is admin
export const isAdmin = () => {
  return getUserType() === "admin";
};

// Check if user is doctor
export const isDoctor = () => {
  return getUserType() === "doctor";
};

// Check if user is patient
export const isPatient = () => {
  return getUserType() === "patient";
};

// Get JWT token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Parse JWT token to get payload
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;

  const decoded = parseJwt(token);
  if (!decoded) return true;

  // Check if expiration time is past current time
  return decoded.exp * 1000 < Date.now();
};

// Check if user needs to refresh token
export const shouldRefreshToken = () => {
  const token = getToken();
  if (!token) return false;

  const decoded = parseJwt(token);
  if (!decoded) return true;

  // If token will expire in the next 5 minutes, refresh it
  const fiveMinutes = 5 * 60 * 1000;
  return decoded.exp * 1000 - Date.now() < fiveMinutes;
};
