import express from "express";
import {
  getTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
} from "../controllers/labtest.controllers.js";

const router = express.Router();

router.route("/").get(getTests);
router.route("/").post(createTest);
router.route("/:id").get(getTest);
router.route("/:id").patch(updateTest);
router.route("/:id").delete(deleteTest);

export default router;
