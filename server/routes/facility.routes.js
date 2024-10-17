import express from "express";
import {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
} from "../controllers/facility.controllers.js";
import { authenticateJWT, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

// All routes
router.route("/create").post(authenticateJWT, verifyAdmin, createFacility);
router.route("/").get(authenticateJWT, getAllFacilities);
router
  .route("/:id")
  .get(authenticateJWT, verifyAdmin, getFacilityById)
  .put(authenticateJWT, verifyAdmin, updateFacility)
  .delete(authenticateJWT, verifyAdmin, deleteFacility);

export default router;
