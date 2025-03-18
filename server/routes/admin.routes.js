import express from "express";
import {
  registerAdmin,
  registerUser,
  deleteUser,
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
} from "../controllers/admin.controller.js";
import { adminMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin routes (admin only)
router.post("/register-admin", adminMiddleware, registerAdmin); // Admin only
router.post("/register", adminMiddleware, registerUser); // Admin only
router.delete("/users/:userId", adminMiddleware, deleteUser); // Admin can delete users
router.get("/users", adminMiddleware, getAllUsers); // Admin can get all users

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
router.get("/doctors", adminMiddleware, getDoctors); // Get all doctors
router.get("/doctors/:doctorId", adminMiddleware, getDoctorById); // Get doctor by id
router.get(
  "/doctors/specialization/:specialization",
  adminMiddleware,
  getDoctorsBySpecialization
); // Get doctors by specialization

// Patient routes
router.get("/patients", adminMiddleware, getPatients); // Get all patients
router.get("/patients/:patientId", adminMiddleware, getPatientById); // Get patient by id

export default router;
