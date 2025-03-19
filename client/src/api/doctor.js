// src/api/doctor.js
import api from "./index";
import { API } from "../constants/api";

export const doctorAPI = {
  // Profile
  getDoctorProfile: () => api.get(API.DOCTORS.GET_PROFILE),
  updateDoctorProfile: (profileData) =>
    api.put(API.DOCTORS.UPDATE_PROFILE, profileData),

  // Specializations
  assignSpecializations: (specializationIds) =>
    api.post(API.DOCTORS.ASSIGN_SPECIALIZATIONS, { specializationIds }),
  removeSpecializations: (specializationIds) =>
    api.delete(API.DOCTORS.REMOVE_SPECIALIZATIONS, {
      data: { specializationIds },
    }),

  // Appointments
  getAppointments: () => api.get(API.DOCTORS.GET_APPOINTMENTS),
  createAppointment: (appointmentData) =>
    api.post(API.DOCTORS.CREATE_APPOINTMENT, appointmentData),
  updateAppointment: (appointmentId, appointmentData) =>
    api.put(API.DOCTORS.UPDATE_APPOINTMENT(appointmentId), appointmentData),
  deleteAppointment: (appointmentId) =>
    api.delete(API.DOCTORS.DELETE_APPOINTMENT(appointmentId)),

  // Prescriptions
  createPrescription: (prescriptionData) =>
    api.post(API.DOCTORS.CREATE_PRESCRIPTION, prescriptionData),
  updatePrescription: (prescriptionId, prescriptionData) =>
    api.put(API.DOCTORS.UPDATE_PRESCRIPTION(prescriptionId), prescriptionData),

  // Patient records
  createPatientRecord: (recordData) =>
    api.post(API.DOCTORS.CREATE_PATIENT_RECORD, recordData),
  updatePatientRecord: (recordId, recordData) =>
    api.put(API.DOCTORS.UPDATE_PATIENT_RECORD(recordId), recordData),

  // Medical reports
  createMedicalReport: (reportData) =>
    api.post(API.DOCTORS.CREATE_MEDICAL_REPORT, reportData),
  updateMedicalReport: (reportId, reportData) =>
    api.put(API.DOCTORS.UPDATE_MEDICAL_REPORT(reportId), reportData),

  // Patients
  getMyPatients: () => api.get(API.DOCTORS.GET_MY_PATIENTS),

  // Notifications
  getNotifications: () => api.get(API.DOCTORS.GET_NOTIFICATIONS),
  markNotificationAsRead: (notificationId) =>
    api.put(API.DOCTORS.MARK_NOTIFICATION_AS_READ(notificationId)),
};

export default doctorAPI;
