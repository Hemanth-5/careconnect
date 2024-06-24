import express from "express";
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointment.controllers.js";

const router = express.Router();

router.route("/").get(getAppointments);
router.route("/").post(createAppointment);
router.route("/:id").get(getAppointment);
router.route("/:id").patch(updateAppointment);
router.route("/:id").delete(deleteAppointment);

export default router;
