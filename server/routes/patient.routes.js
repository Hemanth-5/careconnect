import express from "express";
import {
  getPatientDetails,
  updatePatientProfile,
  scheduleAppointment,
  getPatientAppointments,
  getPatientPrescriptions,
  getPatientNotifications,
  acknowledgeNotification,
} from "../controllers/patient.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes (authentication required)

// Get the patient's profile details
router.get("/profile", authMiddleware, getPatientDetails);

// Update the patient's profile details
router.put("/profile", authMiddleware, updatePatientProfile);

// Schedule an appointment
router.post("/appointments", authMiddleware, scheduleAppointment);

// Get the patient's upcoming appointments
router.get("/appointments", authMiddleware, getPatientAppointments);

// Get the patient's prescriptions
router.get("/prescriptions", authMiddleware, getPatientPrescriptions);

// Get the patient's notifications
router.get("/notifications", authMiddleware, getPatientNotifications);

// Acknowledge a notification (mark as read)
router.put(
  "/notifications/:notificationId",
  authMiddleware,
  acknowledgeNotification
);

export default router;
