import express from "express";
import {
  getSpecializations,
  getSpecialization,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization,
  displayPendingRequests,
  approveOrRejectRequest,
  requestNewSpecialization,
} from "../controllers/specialization.controllers.js";
import {
  authenticateJWT,
  verifyAdmin,
  verifyDoctor,
} from "../middlewares/auth.js";

const router = express.Router();

// All routes
router
  .route("/pending-requests")
  .get(authenticateJWT, verifyAdmin, displayPendingRequests);
router
  .route("/approve-request/:id")
  .put(authenticateJWT, verifyAdmin, approveOrRejectRequest);

router
  .route("/request-specialization")
  .post(authenticateJWT, verifyDoctor, requestNewSpecialization);

router
  .route("/")
  .get(authenticateJWT, getSpecializations)
  .post(authenticateJWT, verifyAdmin, createSpecialization);
router
  .route("/:id")
  .get(authenticateJWT, verifyAdmin, getSpecialization)
  .put(authenticateJWT, verifyAdmin, updateSpecialization)
  .delete(authenticateJWT, verifyAdmin, deleteSpecialization);

export default router;
