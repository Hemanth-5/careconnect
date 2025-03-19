// src/api/patient.js
import api from "./index";
import { API } from "../constants/api";

export const patientAPI = {
  // Profile
  getPatientProfile: () => api.get(API.PATIENTS.GET_PROFILE),
  updatePatientProfile: (profileData) =>
    api.put(API.PATIENTS.UPDATE_PROFILE, profileData),

  // Appointments
  getAppointments: () => api.get(API.PATIENTS.GET_APPOINTMENTS),

  // Prescriptions
  getPrescriptions: () => api.get(API.PATIENTS.GET_PRESCRIPTIONS),

  // Notifications
  getNotifications: () => api.get(API.PATIENTS.GET_NOTIFICATIONS),
  markNotificationAsRead: (notificationId) =>
    api.put(API.PATIENTS.MARK_NOTIFICATION_AS_READ(notificationId)),
};

export default patientAPI;
