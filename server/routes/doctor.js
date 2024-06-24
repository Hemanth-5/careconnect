import express from "express";
import {
  createDoctor,
  getDoctorById,
  getDoctors,
} from "../controllers/doctor.js";

const router = express.Router();
router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.post("/register/:id", createDoctor);

export default router;
