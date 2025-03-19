// src/constants/actionTypes.js

// Auth actions
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const REFRESH_TOKEN_REQUEST = "REFRESH_TOKEN_REQUEST";
export const REFRESH_TOKEN_SUCCESS = "REFRESH_TOKEN_SUCCESS";
export const REFRESH_TOKEN_FAIL = "REFRESH_TOKEN_FAIL";
export const LOGOUT = "LOGOUT";
export const GET_USER_PROFILE = "GET_USER_PROFILE";
export const UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE";
export const CHANGE_PASSWORD = "CHANGE_PASSWORD";

// Admin actions
export const REGISTER_ADMIN = "REGISTER_ADMIN";
export const REGISTER_USER = "REGISTER_USER";
export const GET_ALL_USERS = "GET_ALL_USERS";
export const DELETE_USER = "DELETE_USER";
export const GET_SPECIALIZATIONS = "GET_SPECIALIZATIONS";
export const CREATE_SPECIALIZATION = "CREATE_SPECIALIZATION";
export const UPDATE_SPECIALIZATION = "UPDATE_SPECIALIZATION";
export const DELETE_SPECIALIZATION = "DELETE_SPECIALIZATION";
export const GET_ALL_DOCTORS = "GET_ALL_DOCTORS";
export const GET_DOCTOR_BY_ID = "GET_DOCTOR_BY_ID";
export const GET_DOCTORS_BY_SPECIALIZATION = "GET_DOCTORS_BY_SPECIALIZATION";
export const GET_ALL_PATIENTS = "GET_ALL_PATIENTS";
export const GET_PATIENT_BY_ID = "GET_PATIENT_BY_ID";

// Doctor actions
export const GET_DOCTOR_PROFILE = "GET_DOCTOR_PROFILE";
export const UPDATE_DOCTOR_PROFILE = "UPDATE_DOCTOR_PROFILE";
export const ASSIGN_SPECIALIZATIONS = "ASSIGN_SPECIALIZATIONS";
export const REMOVE_SPECIALIZATIONS = "REMOVE_SPECIALIZATIONS";
export const GET_DOCTOR_APPOINTMENTS = "GET_DOCTOR_APPOINTMENTS";
export const CREATE_APPOINTMENT = "CREATE_APPOINTMENT";
export const UPDATE_APPOINTMENT = "UPDATE_APPOINTMENT";
export const DELETE_APPOINTMENT = "DELETE_APPOINTMENT";
export const CREATE_PRESCRIPTION = "CREATE_PRESCRIPTION";
export const UPDATE_PRESCRIPTION = "UPDATE_PRESCRIPTION";
export const CREATE_PATIENT_RECORD = "CREATE_PATIENT_RECORD";
export const UPDATE_PATIENT_RECORD = "UPDATE_PATIENT_RECORD";
export const CREATE_MEDICAL_REPORT = "CREATE_MEDICAL_REPORT";
export const UPDATE_MEDICAL_REPORT = "UPDATE_MEDICAL_REPORT";
export const GET_MY_PATIENTS = "GET_MY_PATIENTS";
export const GET_DOCTOR_NOTIFICATIONS = "GET_DOCTOR_NOTIFICATIONS";
export const MARK_DOCTOR_NOTIFICATION_AS_READ =
  "MARK_DOCTOR_NOTIFICATION_AS_READ";

// Patient actions
export const GET_PATIENT_PROFILE = "GET_PATIENT_PROFILE";
export const UPDATE_PATIENT_PROFILE = "UPDATE_PATIENT_PROFILE";
export const GET_PATIENT_APPOINTMENTS = "GET_PATIENT_APPOINTMENTS";
export const GET_PATIENT_PRESCRIPTIONS = "GET_PATIENT_PRESCRIPTIONS";
export const GET_PATIENT_NOTIFICATIONS = "GET_PATIENT_NOTIFICATIONS";
export const MARK_PATIENT_NOTIFICATION_AS_READ =
  "MARK_PATIENT_NOTIFICATION_AS_READ";
