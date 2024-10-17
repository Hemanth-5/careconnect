import express from "express";
import {
  createDisease,
  getDiseases,
  getDisease,
  updateDisease,
  deleteDisease,
} from "../controllers/disease.controllers.js";
import { authenticateJWT, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

// All routes
router
  .route("/")
  .get(authenticateJWT, getDiseases)
  .post(authenticateJWT, verifyAdmin, createDisease);

router
  .route("/:id")
  .get(authenticateJWT, getDisease)
  .patch(authenticateJWT, verifyAdmin, updateDisease)
  .delete(authenticateJWT, verifyAdmin, deleteDisease);

export default router;
