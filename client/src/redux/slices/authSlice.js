import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../constants/api";

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Create request body with email and password if provided
      const requestBody = { email };
      if (password) {
        requestBody.password = password;
      }

      const response = await fetch(API.USERS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Login failed");
      }

      // Store tokens in localStorage
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Decode JWT to get user info
      const tokenData = JSON.parse(atob(data.accessToken.split(".")[1]));
      localStorage.setItem("userType", tokenData.role);

      return {
        user: tokenData,
        token: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error) {
      return rejectWithValue(error.message || "An error occurred during login");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return rejectWithValue("No refresh token available");
      }

      const response = await fetch(API.USERS.REFRESH_TOKEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Token refresh failed");
      }

      // Update token in localStorage
      localStorage.setItem("token", data.accessToken);

      // Decode JWT to get user info
      const tokenData = JSON.parse(atob(data.accessToken.split(".")[1]));

      return {
        user: tokenData,
        token: data.accessToken,
      };
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred during token refresh"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    // Clear auth data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("rememberedUser");

    return null;
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      const response = await fetch(API.USERS.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch user profile");
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while fetching user profile"
      );
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  userType: localStorage.getItem("userType") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  userProfile: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    checkAuthState: (state) => {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      const userType = localStorage.getItem("userType");

      state.token = token;
      state.refreshToken = refreshToken;
      state.userType = userType;
      state.isAuthenticated = !!token;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login reducers
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.userType = action.payload.user.role;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.userType = null;
      })

      // Refresh token reducers
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Token refresh failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.userType = null;
      })

      // Logout reducers
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.userType = null;
        state.userProfile = null;
      })

      // Fetch user profile reducers
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user profile";
      });
  },
});

// Export actions and reducer
export const { clearError, setUser, checkAuthState } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserType = (state) => state.auth.userType;
export const selectUser = (state) => state.auth.user;
