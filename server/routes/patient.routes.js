import express from "express";
import {
  getAllPatients,
  getPatient,
  updatePatient,
  deletePatient,
  displayPatientInfo,
  createPatient,
  updatePatientDetails,
} from "../controllers/patient.controllers.js";
import { authenticateJWT, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();
router.route("/info").get(authenticateJWT, displayPatientInfo);
router.route("/register").post(authenticateJWT, createPatient);
router.route("/update").put(authenticateJWT, updatePatientDetails);

router
  .route("/:id")
  .get(authenticateJWT, verifyAdmin, getPatient)
  .put(authenticateJWT, verifyAdmin, updatePatient)
  .delete(authenticateJWT, verifyAdmin, deletePatient);
router.route("/").get(authenticateJWT, verifyAdmin, getAllPatients);

export default router;
