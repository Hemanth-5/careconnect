import express from "express";
import {
  registerAdmin,
  registerUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getSpecializations,
  updateSpecialization,
  createSpecialization,
  deleteSpecialization,
  getDoctors,
  getDoctorById,
  getDoctorsBySpecialization,
  getPatients,
  getPatientById,
  updateDoctor,
  updatePatient,
} from "../controllers/admin.controller.js";

import {
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getAppointmentAnalytics,
} from "../controllers/appointment.controller.js";

import { adminMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin routes (admin only)
router.post("/register-admin", adminMiddleware, registerAdmin); // Admin only
router.post("/register", adminMiddleware, registerUser); // Admin only
router.delete("/users/:userId", adminMiddleware, deleteUser); // Admin can delete users
router.get("/users", adminMiddleware, getAllUsers); // Admin can get all users
router.put("/users/:userId", adminMiddleware, updateUser); // Admin can update users

// Specialization routes
router.get("/specializations", adminMiddleware, getSpecializations); // Get all specializations
router.post("/specializations", adminMiddleware, createSpecialization); // Admin can create specializations
router.put(
  "/specializations/:specializationId",
  adminMiddleware,
  updateSpecialization
); // Admin can update specializations
router.delete(
  "/specializations/:specializationId",
  adminMiddleware,
  deleteSpecialization
); // Admin can delete specializations

// Doctor routes
router.get(
  "/doctors/specialization/:specializationId",
  adminMiddleware,
  getDoctorsBySpecialization
); // This specific route should come first
router.get("/doctors", adminMiddleware, getDoctors); // Get all doctors
router.get("/doctors/:doctorId", adminMiddleware, getDoctorById); // Get doctor by id
router.put("/doctors/:doctorId", adminMiddleware, updateDoctor); // Update doctor by id

// Patient routes
router.get("/patients", adminMiddleware, getPatients); // Get all patients
router.get("/patients/:patientId", adminMiddleware, getPatientById); // Get patient by id
router.put("/patients/:patientId", adminMiddleware, updatePatient); // Update patient by id

// Admin routes for appointment management
router.get("/appointments", adminMiddleware, getAllAppointments);
router.get("/appointments/analytics", adminMiddleware, getAppointmentAnalytics);
router.get("/appointments/:appointmentId", adminMiddleware, getAppointmentById);
router.put(
  "/appointments/:appointmentId/status",
  adminMiddleware,
  updateAppointmentStatus
);

export default router;
