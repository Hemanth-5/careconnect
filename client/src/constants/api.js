const BASE_URL = "http://localhost:5000/api";

export const API = {
  USERS: {
    LOGIN: `${BASE_URL}/users/login`,
    REFRESH_TOKEN: `${BASE_URL}/users/refresh-token`,
    ME: `${BASE_URL}/users/me`,
    UPDATE_PROFILE: `${BASE_URL}/users/me`,
    CHANGE_PASSWORD: `${BASE_URL}/users/me/password`,
  },
  ADMIN: {
    REGISTER: `${BASE_URL}/admin/register`,
    DELETE: (userId) => `${BASE_URL}/admin/${userId}`,
    GET_ALL: `${BASE_URL}/admin`,
  },
  DOCTORS: {
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
