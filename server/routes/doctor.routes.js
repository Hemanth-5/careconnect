import express from "express";
import {
  getDoctorProfile,
  updateDoctorProfile,
  assignSpecializations,
  removeSpecializations,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  createPrescription,
  updatePrescription,
  createPatientRecord,
  updatePatientRecord,
  createMedicalReport,
  updateMedicalReport,
  getNotifications,
  markNotificationAsRead,
} from "../controllers/doctor.controller.js";
import { doctorMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes (authentication required)
// Get doctor profile
router.get("/profile", doctorMiddleware, getDoctorProfile);

// Update doctor profile
router.put("/profile", doctorMiddleware, updateDoctorProfile);

// Assign specializations to doctor
router.put("/me/specializations", doctorMiddleware, assignSpecializations);

// Remove specializations from doctor
router.delete("/me/specializations", doctorMiddleware, removeSpecializations);

// Get all appointments for the doctor
router.get("/appointments", doctorMiddleware, getAppointments);

// Create a new appointment
router.post("/appointments", doctorMiddleware, createAppointment);

// Update an existing appointment
router.put("/appointments/:appointmentId", doctorMiddleware, updateAppointment);

// Delete an appointment
router.delete(
  "/appointments/:appointmentId",
  doctorMiddleware,
  deleteAppointment
);

// Create a new prescription
router.post("/prescriptions", doctorMiddleware, createPrescription);

// Update an existing prescription
router.put(
  "/prescriptions/:prescriptionId",
  doctorMiddleware,
  updatePrescription
);

// Create a new patient record
router.post("/patient-records", doctorMiddleware, createPatientRecord);

// Update an existing patient record
router.put("/patient-records/:recordId", doctorMiddleware, updatePatientRecord);

// Create a new medical report
router.post("/medical-reports", doctorMiddleware, createMedicalReport);

// Update an existing medical report
router.put("/medical-reports/:reportId", doctorMiddleware, updateMedicalReport);

// Get notifications for the doctor
router.get("/notifications", doctorMiddleware, getNotifications);

// Mark a notification as read
router.put(
  "/notifications/:notificationId",
  doctorMiddleware,
  markNotificationAsRead
);

export default router;
