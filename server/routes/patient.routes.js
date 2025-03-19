import express from "express";
import {
  getPatientDetails,
  updatePatientProfile,
  getPatientAppointments,
  getPatientPrescriptions,
  getPatientNotifications,
  acknowledgeNotification,
} from "../controllers/patient.controller.js";
import { patientMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes (authentication required)

// Get the patient's profile details
router.get("/profile", patientMiddleware, getPatientDetails);

// Update the patient's profile details
router.put("/profile", patientMiddleware, updatePatientProfile);

// Schedule an appointment
// router.post("/appointments", patientMiddleware, scheduleAppointment);

// Get the patient's upcoming appointments
router.get("/appointments", patientMiddleware, getPatientAppointments);

// Get the patient's prescriptions
router.get("/prescriptions", patientMiddleware, getPatientPrescriptions);

// Get the patient's notifications
router.get("/notifications", patientMiddleware, getPatientNotifications);

// Acknowledge a notification (mark as read)
router.put(
  "/notifications/:notificationId",
  patientMiddleware,
  acknowledgeNotification
);

export default router;
