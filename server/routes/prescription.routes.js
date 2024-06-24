import express from "express";
import {
  getPrescriptions,
  getPrescription,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescription.controllers.js";

const router = express.Router();

router.route("/").get(getPrescriptions);
router.route("/").post(createPrescription);
router.route("/:id").get(getPrescription);
router.route("/:id").patch(updatePrescription);
router.route("/:id").delete(deletePrescription);

export default router;
