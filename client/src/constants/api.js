// src/constants/api.js
// import dotenv from "dotenv";

// dotenv.config();

// console.log(
//   "process.env.REACT_APP_SERVER_BASE_URL",
//   process.env.REACT_APP_SERVER_BASE_URL
// );

const BASE_URL =
  process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:5000/api";

export const API = {
  USERS: {
    LOGIN: `${BASE_URL}/users/login`,
    REGISTER: `${BASE_URL}/users/register`,
    ME: `${BASE_URL}/users/me`,
    UPDATE_PROFILE: `${BASE_URL}/users/profile`,
    CHANGE_PASSWORD: `${BASE_URL}/users/change-password`,
    REQUEST_PASSWORD_RESET: `${BASE_URL}/users/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/users/reset-password`,
    UPLOAD_PROFILE_IMAGE: `${BASE_URL}/users/profile/upload-image`,
  },
  ADMIN: {
    GET_USERS: `${BASE_URL}/admin/users`,
    REGISTER_USER: `${BASE_URL}/admin/register`,
    UPDATE_USER: (userId) => `${BASE_URL}/admin/users/${userId}`,
    DELETE_USER: (userId) => `${BASE_URL}/admin/users/${userId}`,
    GET_SPECIALIZATIONS: `${BASE_URL}/admin/specializations`,
    CREATE_SPECIALIZATION: `${BASE_URL}/admin/specializations`,
    UPDATE_SPECIALIZATION: (specId) =>
      `${BASE_URL}/admin/specializations/${specId}`,
    DELETE_SPECIALIZATION: (specId) =>
      `${BASE_URL}/admin/specializations/${specId}`,
    GET_DOCTORS: `${BASE_URL}/admin/doctors`,
    GET_DOCTOR_BY_ID: (doctorId) => `${BASE_URL}/admin/doctors/${doctorId}`,
    GET_DOCTORS_BY_SPECIALIZATION: (specId) =>
      `${BASE_URL}/admin/doctors/specialization/${specId}`,
    UPDATE_DOCTOR: (doctorId) => `${BASE_URL}/admin/doctors/${doctorId}`,
    GET_PATIENTS: `${BASE_URL}/admin/patients`,
    GET_PATIENT_BY_ID: (patientId) => `${BASE_URL}/admin/patients/${patientId}`,
    UPDATE_PATIENT: (patientId) => `${BASE_URL}/admin/patients/${patientId}`,
    GET_APPOINTMENTS: `${BASE_URL}/admin/appointments`,
    GET_APPOINTMENT_BY_ID: (appointmentId) =>
      `${BASE_URL}/admin/appointments/${appointmentId}`,
    UPDATE_APPOINTMENT_STATUS: (appointmentId) =>
      `${BASE_URL}/admin/appointments/${appointmentId}/status`,
    GET_APPOINTMENT_ANALYTICS: `${BASE_URL}/admin/appointments/analytics`,
  },
  DOCTORS: {
    DASHBOARD_STATS: `${BASE_URL}/doctors/dashboard`,
    GET_PROFILE: `${BASE_URL}/doctors/profile`,
    UPDATE_PROFILE: `${BASE_URL}/doctors/profile`,
    UPLOAD_PROFILE_IMAGE: `${BASE_URL}/doctors/profile/upload-image`,
    GET_SPECIALIZATIONS: `${BASE_URL}/doctors/specializations`,
    ASSIGN_SPECIALIZATIONS: `${BASE_URL}/doctors/specializations/assign`,
    REMOVE_SPECIALIZATIONS: `${BASE_URL}/doctors/specializations/remove`,
    GET_APPOINTMENTS: `${BASE_URL}/doctors/appointments`,
    CREATE_APPOINTMENT: `${BASE_URL}/doctors/appointments`,
    UPDATE_APPOINTMENT: (appointmentId) =>
      `${BASE_URL}/doctors/appointments/${appointmentId}`,
    DELETE_APPOINTMENT: (appointmentId) =>
      `${BASE_URL}/doctors/appointments/${appointmentId}`,
    GET_MY_PATIENTS: `${BASE_URL}/doctors/patients`,
    GET_PATIENT_BY_ID: (patientId) =>
      `${BASE_URL}/doctors/patients/${patientId}`,
    GET_ALL_PATIENTS: `${BASE_URL}/doctors/all-patients`,
    GET_PRESCRIPTIONS: `${BASE_URL}/doctors/prescriptions`,
    CREATE_PRESCRIPTION: `${BASE_URL}/doctors/prescriptions`,
    UPDATE_PRESCRIPTION: (prescriptionId) =>
      `${BASE_URL}/doctors/prescriptions/${prescriptionId}`,
    GET_PATIENT_RECORDS: `${BASE_URL}/doctors/patient-records`,
    GET_PATIENT_RECORD_BY_ID: (recordId) =>
      `${BASE_URL}/doctors/patient-records/${recordId}`,
    CREATE_PATIENT_RECORD: `${BASE_URL}/doctors/patient-records`,
    UPDATE_PATIENT_RECORD: (recordId) =>
      `${BASE_URL}/doctors/patient-records/${recordId}`,
    DELETE_PATIENT_RECORD: (recordId) =>
      `${BASE_URL}/doctors/patient-records/${recordId}`,
    UPLOAD_RECORD_ATTACHMENTS: (recordId) =>
      `${BASE_URL}/doctors/patient-records/${recordId}/attachments`,
    CREATE_MEDICAL_REPORT: `${BASE_URL}/doctors/reports`,
    UPDATE_MEDICAL_REPORT: (reportId) =>
      `${BASE_URL}/doctors/reports/${reportId}`,
    DELETE_MEDICAL_REPORT: (reportId) =>
      `${BASE_URL}/doctors/reports/${reportId}`,
    GET_NOTIFICATIONS: `${BASE_URL}/doctors/notifications`,
    MARK_NOTIFICATION_AS_READ: (notificationId) =>
      `${BASE_URL}/doctors/notifications/${notificationId}`,
    MARK_ALL_NOTIFICATIONS_AS_READ: `${BASE_URL}/doctors/notifications/mark-all-read`,
    // Reports endpoints
    GET_REPORTS: `${BASE_URL}/doctors/reports`,
    GET_REPORT_BY_ID: (reportId) => `${BASE_URL}/doctors/reports/${reportId}`,
    CREATE_REPORT: `${BASE_URL}/doctors/reports`,
    UPDATE_REPORT: (reportId) => `${BASE_URL}/doctors/reports/${reportId}`,
    DELETE_REPORT: (reportId) => `${BASE_URL}/doctors/reports/${reportId}`,
    // Add new endpoint for adding items to a report
    ADD_ITEMS_TO_REPORT: (reportId) =>
      `${BASE_URL}/doctors/reports/${reportId}/items`,
  },
  PATIENTS: {
    GET_PROFILE: `${BASE_URL}/patients/profile`,
    UPDATE_PROFILE: `${BASE_URL}/patients/profile`,
    GET_APPOINTMENTS: `${BASE_URL}/patients/appointments`,
    SCHEDULE_APPOINTMENT: `${BASE_URL}/patients/appointments`,
    UPDATE_APPOINTMENT: (appointmentId) =>
      `${BASE_URL}/patients/appointments/${appointmentId}`,
    CANCEL_APPOINTMENT: (appointmentId) =>
      `${BASE_URL}/patients/appointments/${appointmentId}/cancel`,
    GET_PRESCRIPTIONS: `${BASE_URL}/patients/prescriptions`,
    GET_PRESCRIPTION_BY_ID: (prescriptionId) =>
      `${BASE_URL}/patients/prescriptions/${prescriptionId}`,
    GET_MEDICAL_RECORDS: `${BASE_URL}/patients/medical-records`,
    GET_MEDICAL_RECORD_BY_ID: (recordId) =>
      `${BASE_URL}/patients/medical-records/${recordId}`,
    GET_AVAILABLE_DOCTORS: `${BASE_URL}/patients/doctors`,
    GET_DOCTOR_BY_ID: (doctorId) => `${BASE_URL}/patients/doctors/${doctorId}`,
    GET_NOTIFICATIONS: `${BASE_URL}/patients/notifications`,
    MARK_NOTIFICATION_AS_READ: (notificationId) =>
      `${BASE_URL}/patients/notifications/${notificationId}`,
    MARK_ALL_NOTIFICATIONS_AS_READ: `${BASE_URL}/patients/notifications/mark-all-read`,
    GET_MESSAGES: `${BASE_URL}/patients/messages`,
    SEND_MESSAGE: `${BASE_URL}/patients/messages`,
  },
};
