import express from "express";
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDoctorAppointments,
  confirmAppointment,
  cancelAppointment,
  getPatientAppointments,
} from "../controllers/appointment.controllers.js";
import {
  authenticateJWT,
  verifyAdmin,
  verifyDoctor,
} from "../middlewares/auth.js";

const router = express.Router();

// All routes
router.route("/").get(authenticateJWT, verifyAdmin, getAllAppointments);

router
  .route("/doctor/:doctorId")
  .get(authenticateJWT, verifyDoctor, getDoctorAppointments);
router
  .route("/confirm/:id")
  .put(authenticateJWT, verifyDoctor, confirmAppointment);
router
  .route("/cancel/:id")
  .put(authenticateJWT, verifyDoctor, cancelAppointment);

router
  .route("/patient/:patientId")
  .get(authenticateJWT, getPatientAppointments);

// For create, if type is doctor verify admin if not verify doctor, use query params
router.route("/create").post(
  authenticateJWT,
  (req, res, next) => {
    const type = req.query.type;
    if (type === "admin") {
      verifyAdmin(req, res, next);
    } else if (type === "doctor") {
      verifyDoctor(req, res, next);
    } else {
      res.status(400).send("Invalid type");
    }
  },
  createAppointment
);

router
  .route("/:id")
  .get(authenticateJWT, verifyAdmin, getAppointmentById)
  .put(authenticateJWT, verifyAdmin, updateAppointment)
  .delete(authenticateJWT, verifyAdmin, deleteAppointment);

export default router;
