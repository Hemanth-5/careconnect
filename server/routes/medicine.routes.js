import express from "express";
import {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicine.controllers.js";

const router = express.Router();

router.route("/").get(getMedicines);
router.route("/").post(createMedicine);
router.route("/:id").get(getMedicine);
router.route("/:id").patch(updateMedicine);
router.route("/:id").delete(deleteMedicine);

export default router;
