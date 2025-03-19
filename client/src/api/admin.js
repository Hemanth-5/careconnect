// src/api/admin.js
import api from "./index";
import { API } from "../constants/api";

/**
 * Admin API service
 */
const adminAPI = {
  // User management
  getAllUsers: () => api.get(API.ADMIN.GET_USERS),
  registerUser: (userData) => api.post(API.ADMIN.REGISTER_USER, userData),
  deleteUser: (userId) => api.delete(API.ADMIN.DELETE_USER(userId)),
  updateUser: (userId, userData) =>
    api.put(API.ADMIN.UPDATE_USER(userId), userData),

  // Specialization management
  getSpecializations: () => api.get(API.ADMIN.GET_SPECIALIZATIONS),
  createSpecialization: (data) =>
    api.post(API.ADMIN.CREATE_SPECIALIZATION, data),
  updateSpecialization: (id, data) =>
    api.put(API.ADMIN.UPDATE_SPECIALIZATION(id), data),
  deleteSpecialization: (id) => api.delete(API.ADMIN.DELETE_SPECIALIZATION(id)),

  // Doctor management
  getAllDoctors: () => api.get(API.ADMIN.GET_DOCTORS),
  getDoctorById: (id) => api.get(API.ADMIN.GET_DOCTOR_BY_ID(id)),
  updateDoctor: (id, data) => api.put(API.ADMIN.UPDATE_DOCTOR(id), data),
  getDoctorsBySpecialization: (specId) =>
    api.get(API.ADMIN.GET_DOCTORS_BY_SPECIALIZATION(specId)),

  // Patient management
  getAllPatients: () => api.get(API.ADMIN.GET_PATIENTS),
  getPatientById: (id) => api.get(API.ADMIN.GET_PATIENT_BY_ID(id)),
  updatePatient: (id, data) => api.put(API.ADMIN.UPDATE_PATIENT(id), data),

  // Appointment management
  getAllAppointments: (filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.status) queryParams.append("status", filters.status);
    if (filters.doctorId) queryParams.append("doctorId", filters.doctorId);
    if (filters.patientId) queryParams.append("patientId", filters.patientId);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);

    const queryString = queryParams.toString();
    return api.get(
      `${API.ADMIN.GET_APPOINTMENTS}${queryString ? `?${queryString}` : ""}`
    );
  },

  getAppointmentById: (id) => api.get(API.ADMIN.GET_APPOINTMENT_BY_ID(id)),

  updateAppointmentStatus: (id, data) =>
    api.put(API.ADMIN.UPDATE_APPOINTMENT_STATUS(id), data),

  // Analytics
  getAppointmentAnalytics: (filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.period) queryParams.append("period", filters.period);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);

    const queryString = queryParams.toString();
    return api.get(
      `${API.ADMIN.GET_APPOINTMENT_ANALYTICS}${
        queryString ? `?${queryString}` : ""
      }`
    );
  },
};

export default adminAPI;
