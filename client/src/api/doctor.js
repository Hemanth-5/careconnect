import axios from "axios";
import { API } from "../constants/api";

// Helper to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
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
  assignSpecializations: (specializationIds) =>
    axios.post(
      API.DOCTORS.ASSIGN_SPECIALIZATIONS,
      { specializationIds },
      getAuthHeader()
    ),
  removeSpecializations: (specializationIds) =>
    axios.post(
      API.DOCTORS.REMOVE_SPECIALIZATIONS,
      { specializationIds },
      getAuthHeader()
    ),

  // Appointments
  getAppointments: () =>
    axios.get(API.DOCTORS.GET_APPOINTMENTS, getAuthHeader()),
  // getAppointment: (id) =>
  //   axios.get(`${API.DOCTORS.APPOINTMENTS}/${id}`, getAuthHeader()),
  createAppointment: (data) =>
    axios.post(API.DOCTORS.CREATE_APPOINTMENT, data, getAuthHeader()),
  updateAppointment: (id, data) =>
    axios.put(`${API.DOCTORS.UPDATE_APPOINTMENT(id)}`, data, getAuthHeader()),
  deleteAppointment: (id) =>
    axios.delete(`${API.DOCTORS.DELETE_APPOINTMENT}/${id}`, getAuthHeader()),

  // Patients
  getMyPatients: () => axios.get(API.DOCTORS.GET_MY_PATIENTS, getAuthHeader()),
  getAllPatients: () => axios.get(API.DOCTORS.ALL_PATIENTS, getAuthHeader()), // Add this new method
  // getPatient: (id) =>
  //   axios.get(`${API.DOCTORS.PATIENTS}/${id}`, getAuthHeader()),
  // getPatientHistory: (id) =>
  //   axios.get(`${API.DOCTORS.PATIENTS}/${id}/history`, getAuthHeader()),

  // Prescriptions
  getPrescriptions: () => axios.get(API.DOCTORS.PRESCRIPTIONS, getAuthHeader()),
  getPrescription: (id) =>
    axios.get(`${API.DOCTORS.PRESCRIPTIONS}/${id}`, getAuthHeader()),
  createPrescription: (data) =>
    axios.post(API.DOCTORS.PRESCRIPTIONS, data, getAuthHeader()),
  updatePrescription: (id, data) =>
    axios.put(`${API.DOCTORS.PRESCRIPTIONS}/${id}`, data, getAuthHeader()),
  deletePrescription: (id) =>
    axios.delete(`${API.DOCTORS.PRESCRIPTIONS}/${id}`, getAuthHeader()),

  // Medical Records
  getMedicalRecords: () =>
    axios.get(API.DOCTORS.MEDICAL_RECORDS, getAuthHeader()),
  getMedicalRecord: (id) =>
    axios.get(`${API.DOCTORS.MEDICAL_RECORDS}/${id}`, getAuthHeader()),
  createMedicalRecord: (data) =>
    axios.post(API.DOCTORS.MEDICAL_RECORDS, data, getAuthHeader()),
  updateMedicalRecord: (id, data) =>
    axios.put(`${API.DOCTORS.MEDICAL_RECORDS}/${id}`, data, getAuthHeader()),
  deleteMedicalRecord: (id) =>
    axios.delete(`${API.DOCTORS.MEDICAL_RECORDS}/${id}`, getAuthHeader()),
  uploadMedicalRecordAttachment: (recordId, formData) =>
    axios.post(
      `${API.DOCTORS.MEDICAL_RECORDS}/${recordId}/attachments`,
      formData,
      {
        ...getAuthHeader().headers,
        "Content-Type": "multipart/form-data",
      }
    ),

  // Notifications
  getNotifications: () => axios.get(API.DOCTORS.NOTIFICATIONS, getAuthHeader()),
  markNotificationAsRead: (id) =>
    axios.put(`${API.DOCTORS.NOTIFICATIONS}/${id}/read`, {}, getAuthHeader()),
  markAllNotificationsAsRead: () =>
    axios.put(`${API.DOCTORS.NOTIFICATIONS}/read-all`, {}, getAuthHeader()),

  // Medical Reports
  getReports: () => axios.get(API.DOCTORS.REPORTS, getAuthHeader()),
  generateReport: (type, params) =>
    axios.post(
      `${API.DOCTORS.REPORTS}/generate/${type}`,
      params,
      getAuthHeader()
    ),
};

export default doctorAPI;
