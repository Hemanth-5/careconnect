import express from "express";
import {
  getDoctorProfile,
  updateDoctorProfile,
  uploadProfileImage,
  getSpecializations,
  assignSpecializations,
  removeSpecializations,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getPrescriptions,
  createPrescription,
  updatePrescription,
  createPatientRecord,
  updatePatientRecord,
  createMedicalReport,
  updateMedicalReport,
  deleteMedicalReport, // Make sure this is imported
  getMyPatients,
  getNotifications,
  markNotificationAsRead,
  getAllPatients,
  getDoctorDashboard,
} from "../controllers/doctor.controller.js";

// Import report controllers from medicalReport.controller.js
import {
  getDoctorReports as getReports,
  getMedicalReportById as getReportById,
  addItemsToReport,
} from "../controllers/medicalReport.controller.js";

// Import the correct functions from patientRecord.controller.js
import {
  getDoctorPatientRecords as getMedicalRecords,
  getPatientRecordById,
} from "../controllers/patientRecord.controller.js";

import { doctorMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// All routes are protected with doctorMiddleware

// Dashboard
router.get("/dashboard", doctorMiddleware, getDoctorDashboard);

// Doctor Profile
router.get("/profile", doctorMiddleware, getDoctorProfile);
router.put("/profile", doctorMiddleware, updateDoctorProfile);
router.post(
  "/profile/upload-image",
  doctorMiddleware,
  upload.single("image"),
  uploadProfileImage
);

// Specializations
router.get("/specializations", doctorMiddleware, getSpecializations);
router.post("/specializations/assign", doctorMiddleware, assignSpecializations);
router.post("/specializations/remove", doctorMiddleware, removeSpecializations);

// Appointments
router.get("/appointments", doctorMiddleware, getAppointments);
router.post("/appointments", doctorMiddleware, createAppointment);
router.put("/appointments/:appointmentId", doctorMiddleware, updateAppointment);
router.delete(
  "/appointments/:appointmentId",
  doctorMiddleware,
  deleteAppointment
);

// Prescriptions
router.get("/prescriptions", doctorMiddleware, getPrescriptions);
router.post("/prescriptions", doctorMiddleware, createPrescription);
router.put(
  "/prescriptions/:prescriptionId",
  doctorMiddleware,
  updatePrescription
);

// Patient Records
router.get("/patient-records", doctorMiddleware, getMedicalRecords);
router.get(
  "/patient-records/:recordId",
  doctorMiddleware,
  getPatientRecordById
);
router.post("/patient-records", doctorMiddleware, createPatientRecord);
router.put("/patient-records/:recordId", doctorMiddleware, updatePatientRecord);

// Medical Reports
router.get("/reports", doctorMiddleware, getReports);
router.get("/reports/:reportId", doctorMiddleware, getReportById);
router.post("/reports", doctorMiddleware, createMedicalReport);
router.put("/reports/:reportId", doctorMiddleware, updateMedicalReport);
router.delete("/reports/:reportId", doctorMiddleware, deleteMedicalReport);
// New route for adding items to a report
router.post("/reports/:reportId/items", doctorMiddleware, addItemsToReport);

// Patients
router.get("/patients", doctorMiddleware, getMyPatients);
router.get("/all-patients", doctorMiddleware, getAllPatients);

// Notifications
router.get("/notifications", doctorMiddleware, getNotifications);
router.put(
  "/notifications/:notificationId",
  doctorMiddleware,
  markNotificationAsRead
);

export default router;
