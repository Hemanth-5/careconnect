// src/constants/api.js
const BASE_URL = "http://localhost:5000/api";

export const API = {
  USERS: {
    LOGIN: `${BASE_URL}/users/login`,
    REFRESH_TOKEN: `${BASE_URL}/users/refresh-token`,
    ME: `${BASE_URL}/users/me`,
    UPDATE_PROFILE: `${BASE_URL}/users/me`,
    CHANGE_PASSWORD: `${BASE_URL}/users/me/password`,
    // Add password reset endpoints
    REQUEST_PASSWORD_RESET: `${BASE_URL}/password-reset/request`,
    VERIFY_RESET_TOKEN: (token) =>
      `${BASE_URL}/password-reset/verify-token/${token}`,
    RESET_PASSWORD: `${BASE_URL}/password-reset/reset`,
    UPDATE_PROFILE_PICTURE: `${BASE_URL}/users/profile-picture`,
  },
  ADMIN: {
    REGISTER_ADMIN: `${BASE_URL}/admin/register-admin`,
    REGISTER_USER: `${BASE_URL}/admin/register`,
    UPDATE_USER: (userId) => `${BASE_URL}/admin/users/${userId}`,
    DELETE_USER: (userId) => `${BASE_URL}/admin/users/${userId}`,
    GET_USERS: `${BASE_URL}/admin/users`,
    GET_SPECIALIZATIONS: `${BASE_URL}/admin/specializations`,
    CREATE_SPECIALIZATION: `${BASE_URL}/admin/specializations`,
    UPDATE_SPECIALIZATION: (specializationId) =>
      `${BASE_URL}/admin/specializations/${specializationId}`,
    DELETE_SPECIALIZATION: (specializationId) =>
      `${BASE_URL}/admin/specializations/${specializationId}`,

    GET_DOCTORS: `${BASE_URL}/admin/doctors`,
    GET_DOCTOR_BY_ID: (doctorId) => `${BASE_URL}/admin/doctors/${doctorId}`,
    GET_DOCTORS_BY_SPECIALIZATION: (specializationId) =>
      `${BASE_URL}/admin/doctors/specialization/${specializationId}`,
    GET_PATIENTS: `${BASE_URL}/admin/patients`,
    GET_PATIENT_BY_ID: (patientId) => `${BASE_URL}/admin/patients/${patientId}`,
    UPDATE_DOCTOR: (doctorId) => `${BASE_URL}/admin/doctors/${doctorId}`,
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
    ASSIGN_SPECIALIZATIONS: `${BASE_URL}/doctors/me/specializations`,
    REMOVE_SPECIALIZATIONS: `${BASE_URL}/doctors/me/specializations`,
    GET_APPOINTMENTS: `${BASE_URL}/doctors/appointments`,
    CREATE_APPOINTMENT: `${BASE_URL}/doctors/appointments`,
    UPDATE_APPOINTMENT: (appointmentId) =>
      `${BASE_URL}/doctors/appointments/${appointmentId}`,
    DELETE_APPOINTMENT: (appointmentId) =>
      `${BASE_URL}/doctors/appointments/${appointmentId}`,
    CREATE_PRESCRIPTION: `${BASE_URL}/doctors/prescriptions`,
    UPDATE_PRESCRIPTION: (prescriptionId) =>
      `${BASE_URL}/doctors/prescriptions/${prescriptionId}`,
    CREATE_PATIENT_RECORD: `${BASE_URL}/doctors/patient-records`,
    UPDATE_PATIENT_RECORD: (recordId) =>
      `${BASE_URL}/doctors/patient-records/${recordId}`,
    CREATE_MEDICAL_REPORT: `${BASE_URL}/doctors/medical-reports`,
    UPDATE_MEDICAL_REPORT: (reportId) =>
      `${BASE_URL}/doctors/medical-reports/${reportId}`,
    GET_MY_PATIENTS: `${BASE_URL}/doctors/my-patients`,
    ALL_PATIENTS: `${BASE_URL}/doctors/patients`,
    GET_NOTIFICATIONS: `${BASE_URL}/doctors/notifications`,
    MARK_NOTIFICATION_AS_READ: (notificationId) =>
      `${BASE_URL}/doctors/notifications/${notificationId}`,
  },
  PATIENTS: {
    GET_PROFILE: `${BASE_URL}/patients/profile`,
    UPDATE_PROFILE: `${BASE_URL}/patients/profile`,
    GET_APPOINTMENTS: `${BASE_URL}/patients/appointments`,
    GET_PRESCRIPTIONS: `${BASE_URL}/patients/prescriptions`,
    GET_NOTIFICATIONS: `${BASE_URL}/patients/notifications`,
    MARK_NOTIFICATION_AS_READ: (notificationId) =>
      `${BASE_URL}/patients/notifications/${notificationId}`,
  },
};
