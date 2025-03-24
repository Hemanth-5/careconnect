import axios from "axios";
import { API } from "../constants/api";

// Helper to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token is missing");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const patientAPI = {
  // Profile
  getProfile: () => axios.get(API.PATIENTS.GET_PROFILE, getAuthHeader()),
  updateProfile: (data) =>
    axios.put(API.PATIENTS.UPDATE_PROFILE, data, getAuthHeader()),

  // Appointments
  getAppointments: () =>
    axios.get(API.PATIENTS.GET_APPOINTMENTS, getAuthHeader()),
  scheduleAppointment: (data) =>
    axios.post(API.PATIENTS.SCHEDULE_APPOINTMENT, data, getAuthHeader()),
  updateAppointment: (id, data) =>
    axios.put(API.PATIENTS.UPDATE_APPOINTMENT(id), data, getAuthHeader()),
  cancelAppointment: (id) =>
    axios.put(API.PATIENTS.CANCEL_APPOINTMENT(id), {}, getAuthHeader()),

  // Prescriptions
  getPrescriptions: () =>
    axios.get(API.PATIENTS.GET_PRESCRIPTIONS, getAuthHeader()),
  getPrescriptionById: (id) =>
    axios.get(API.PATIENTS.GET_PRESCRIPTION_BY_ID(id), getAuthHeader()),

  // Medical Records
  getMedicalRecords: () =>
    axios.get(API.PATIENTS.GET_MEDICAL_RECORDS, getAuthHeader()),
  getMedicalRecordById: (id) =>
    axios.get(API.PATIENTS.GET_MEDICAL_RECORD_BY_ID(id), getAuthHeader()),

  // Doctors
  getAvailableDoctors: (specialization = "") =>
    axios.get(
      API.PATIENTS.GET_AVAILABLE_DOCTORS +
        (specialization ? `?specialization=${specialization}` : ""),
      getAuthHeader()
    ),
  getDoctorById: (id) =>
    axios.get(API.PATIENTS.GET_DOCTOR_BY_ID(id), getAuthHeader()),

  // Notifications
  getNotifications: () =>
    axios.get(API.PATIENTS.GET_NOTIFICATIONS, getAuthHeader()),
  markNotificationAsRead: (id) =>
    axios.put(API.PATIENTS.MARK_NOTIFICATION_AS_READ(id), {}, getAuthHeader()),
  markAllNotificationsAsRead: () =>
    axios.put(API.PATIENTS.MARK_ALL_NOTIFICATIONS_AS_READ, {}, getAuthHeader()),

  // Messages (if implemented)
  getMessages: () => axios.get(API.PATIENTS.GET_MESSAGES, getAuthHeader()),
  sendMessage: (data) =>
    axios.post(API.PATIENTS.SEND_MESSAGE, data, getAuthHeader()),
};

export default patientAPI;
