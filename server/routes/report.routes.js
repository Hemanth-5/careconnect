import express from "express";
import {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
} from "../controllers/report.controllers.js";

const router = express.Router();

router.route("/").get(getReports);
router.route("/").post(createReport);
router.route("/:id").get(getReport);
router.route("/:id").patch(updateReport);
router.route("/:id").delete(deleteReport);

export default router;
