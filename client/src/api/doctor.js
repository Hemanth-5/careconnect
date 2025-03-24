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

const getMultipartAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token is missing");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };
};

const doctorAPI = {
  // Dashboard
  getDashboardStats: () =>
    axios.get(API.DOCTORS.DASHBOARD_STATS, getAuthHeader()),

  // Profile
  getProfile: () => axios.get(API.DOCTORS.GET_PROFILE, getAuthHeader()),
  updateProfile: (data) =>
    axios.put(API.DOCTORS.UPDATE_PROFILE, data, getAuthHeader()),
  uploadProfileImage: (formData) =>
    axios.post(
      API.DOCTORS.UPLOAD_PROFILE_IMAGE,
      formData,
      getMultipartAuthHeader()
    ),

  // Appointments
  getAppointments: () =>
    axios.get(API.DOCTORS.GET_APPOINTMENTS, getAuthHeader()),
  createAppointment: (data) =>
    axios.post(API.DOCTORS.CREATE_APPOINTMENT, data, getAuthHeader()),
  updateAppointment: (id, data) =>
    axios.put(API.DOCTORS.UPDATE_APPOINTMENT(id), data, getAuthHeader()),
  deleteAppointment: (id) =>
    axios.delete(API.DOCTORS.DELETE_APPOINTMENT(id), getAuthHeader()),

  // Patients
  getMyPatients: () => axios.get(API.DOCTORS.GET_MY_PATIENTS, getAuthHeader()),
  getPatientById: (id) =>
    axios.get(API.DOCTORS.GET_PATIENT_BY_ID(id), getAuthHeader()),
  getAllPatients: () =>
    axios.get(API.DOCTORS.GET_ALL_PATIENTS, getAuthHeader()),

  // Specializations
  getSpecializations: () =>
    axios.get(API.DOCTORS.GET_SPECIALIZATIONS, getAuthHeader()),
  assignSpecializations: (data) =>
    axios.post(API.DOCTORS.ASSIGN_SPECIALIZATIONS, data, getAuthHeader()),
  removeSpecializations: (data) =>
    axios.post(API.DOCTORS.REMOVE_SPECIALIZATIONS, data, getAuthHeader()),

  // Prescriptions
  getPrescriptions: () =>
    axios.get(API.DOCTORS.GET_PRESCRIPTIONS, getAuthHeader()),
  createPrescription: (data) =>
    axios.post(API.DOCTORS.CREATE_PRESCRIPTION, data, getAuthHeader()),
  updatePrescription: (id, data) =>
    axios.put(API.DOCTORS.UPDATE_PRESCRIPTION(id), data, getAuthHeader()),

  // Patient Records
  getMedicalRecords: () =>
    axios.get(API.DOCTORS.GET_PATIENT_RECORDS, getAuthHeader()),
  getPatientRecordById: (id) =>
    axios.get(API.DOCTORS.GET_PATIENT_RECORD_BY_ID(id), getAuthHeader()),
  createPatientRecord: (data) =>
    axios.post(API.DOCTORS.CREATE_PATIENT_RECORD, data, getAuthHeader()),
  updatePatientRecord: (id, data) =>
    axios.put(API.DOCTORS.UPDATE_PATIENT_RECORD(id), data, getAuthHeader()),
  deletePatientRecord: (id) =>
    axios.delete(API.DOCTORS.DELETE_PATIENT_RECORD(id), getAuthHeader()),

  // Medical Reports
  getMedicalReports: () =>
    axios.get(API.DOCTORS.GET_MEDICAL_REPORTS, getAuthHeader()),
  createMedicalReport: (data) =>
    axios.post(API.DOCTORS.CREATE_MEDICAL_REPORT, data, getAuthHeader()),
  updateMedicalReport: (id, data) =>
    axios.put(API.DOCTORS.UPDATE_MEDICAL_REPORT(id), data, getAuthHeader()),

  // Notifications
  getNotifications: () =>
    axios.get(API.DOCTORS.GET_NOTIFICATIONS, getAuthHeader()),
  markNotificationAsRead: (id) =>
    axios.put(API.DOCTORS.MARK_NOTIFICATION_AS_READ(id), {}, getAuthHeader()),

  // Reports
  getReports: () => axios.get(API.DOCTORS.GET_REPORTS, getAuthHeader()),
  getReportById: (id) =>
    axios.get(API.DOCTORS.GET_REPORT_BY_ID(id), getAuthHeader()),
  createReport: (data) =>
    axios.post(API.DOCTORS.CREATE_REPORT, data, getAuthHeader()),
  updateReport: (id, data) =>
    axios.put(API.DOCTORS.UPDATE_REPORT(id), data, getAuthHeader()),
  deleteReport: (id) =>
    axios.delete(API.DOCTORS.DELETE_REPORT(id), getAuthHeader()),
};

export default doctorAPI;
