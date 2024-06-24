import express from "express";
import {
  getPatients,
  getPatientProfile,
  getPatient,
  updatePatientProfile,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controllers.js";

const router = express.Router();

router.route("/").get(getPatients);
router.route("/profile").get(getPatientProfile);
router.route("/profile/update").post(updatePatientProfile);
router.route("/:id").get(getPatient);
router.route("/:id").patch(updatePatient);
router.route("/:id").delete(deletePatient);

export default router;
