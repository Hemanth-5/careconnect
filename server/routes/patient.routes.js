import express from "express";
import {
  getPatientDetails,
  updatePatientProfile,
  getPatientAppointments,
  getPatientPrescriptions,
  getPatientNotifications,
  acknowledgeNotification,
  scheduleAppointment,
  updateAppointment,
  cancelAppointment,
  getPatientMedicalRecords,
  getPatientMedicalRecordById,
  getAvailableDoctors,
  getDoctorById,
  getPrescriptionById,
  markAllNotificationsAsRead,
} from "../controllers/patient.controller.js";
import { patientMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes (authentication required)

// Get the patient's profile details
router.get("/profile", patientMiddleware, getPatientDetails);

// Update the patient's profile details
router.put("/profile", patientMiddleware, updatePatientProfile);

// Get the patient's upcoming appointments
router.get("/appointments", patientMiddleware, getPatientAppointments);

// Schedule an appointment
router.post("/appointments", patientMiddleware, scheduleAppointment);

// Update an appointment
router.put(
  "/appointments/:appointmentId",
  patientMiddleware,
  updateAppointment
);

// Cancel an appointment
router.put(
  "/appointments/:appointmentId/cancel",
  patientMiddleware,
  cancelAppointment
);

// Get the patient's prescriptions
router.get("/prescriptions", patientMiddleware, getPatientPrescriptions);

// Get specific prescription details
router.get(
  "/prescriptions/:prescriptionId",
  patientMiddleware,
  getPrescriptionById
);

// Get the patient's medical records
router.get("/medical-records", patientMiddleware, getPatientMedicalRecords);

// Get a specific medical record
router.get(
  "/medical-records/:recordId",
  patientMiddleware,
  getPatientMedicalRecordById
);

// Get available doctors (optionally filtered by specialization)
router.get("/doctors", patientMiddleware, getAvailableDoctors);

// Get specific doctor details
router.get("/doctors/:doctorId", patientMiddleware, getDoctorById);

// Get the patient's notifications
router.get("/notifications", patientMiddleware, getPatientNotifications);

// Acknowledge a notification (mark as read)
router.put(
  "/notifications/:notificationId",
  patientMiddleware,
  acknowledgeNotification
);

// Mark all notifications as read
router.put(
  "/notifications/mark-all-read",
  patientMiddleware,
  markAllNotificationsAsRead
);

export default router;
