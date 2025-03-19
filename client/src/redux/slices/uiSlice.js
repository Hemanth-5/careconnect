import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  sidebarCollapsed: false,
  theme: "light",
  notification: null,
  loading: {
    global: false,
    users: false,
    doctors: false,
    patients: false,
    specializations: false,
    appointments: false,
  },
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
};

// UI slice
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },

    // Theme actions
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    // Notification actions
    showNotification: (state, action) => {
      state.notification = {
        message: action.payload.message,
        type: action.payload.type || "info",
        timeout: action.payload.timeout || 3000,
      };
    },
    clearNotification: (state) => {
      state.notification = null;
    },

    // Loading actions
    setLoading: (state, action) => {
      state.loading[action.payload.key] = action.payload.value;
    },

    // Modal actions
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
    updateModalData: (state, action) => {
      if (state.modal.isOpen) {
        state.modal.data = action.payload;
      }
    },
  },
});

// Export actions and reducer
export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleTheme,
  setTheme,
  showNotification,
  clearNotification,
  setLoading,
  openModal,
  closeModal,
  updateModalData,
} = uiSlice.actions;
export default uiSlice.reducer;

// Selectors
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectTheme = (state) => state.ui.theme;
export const selectNotification = (state) => state.ui.notification;
export const selectLoadingState = (key) => (state) => state.ui.loading[key];
export const selectModal = (state) => state.ui.modal;
