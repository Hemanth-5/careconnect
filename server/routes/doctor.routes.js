import express from "express";
import {
  getAllDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  displayDoctorInfo,
  createDoctor,
  updateSelf,
} from "../controllers/doctor.controllers.js";
import { authenticateJWT, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();
router.route("/info").get(authenticateJWT, displayDoctorInfo);
router.route("/register").post(authenticateJWT, createDoctor);
router.route("/update").put(authenticateJWT, updateSelf);

router
  .route("/:id")
  .get(authenticateJWT, verifyAdmin, getDoctor)
  .put(authenticateJWT, verifyAdmin, updateDoctor)
  .delete(authenticateJWT, verifyAdmin, deleteDoctor);
router.route("/").get(authenticateJWT, verifyAdmin, getAllDoctors);

export default router;
