import express from "express";
import {
  getDoctors,
  getDoctorProfile,
  getDoctor,
  updateDoctorProfile,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controllers.js";

const router = express.Router();

router.route("/").get(getDoctors);
router.route("/profile").get(getDoctorProfile);
router.route("/profile/update").post(updateDoctorProfile);
router.route("/:id").get(getDoctor);
router.route("/:id").patch(updateDoctor);
router.route("/:id").delete(deleteDoctor);

export default router;
