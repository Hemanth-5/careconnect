import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/usersSlice";
import doctorsReducer from "./slices/doctorsSlice";
import patientsReducer from "./slices/patientsSlice";
import specializationsReducer from "./slices/specializationsSlice";
import appointmentsReducer from "./slices/appointmentsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    doctors: doctorsReducer,
    patients: patientsReducer,
    specializations: specializationsReducer,
    appointments: appointmentsReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
