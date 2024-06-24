import express from "express";
import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controllers.js";

const router = express.Router();

router.route("/").get(getReviews);
router.route("/").post(createReview);
router.route("/:id").get(getReview);
router.route("/:id").patch(updateReview);
router.route("/:id").delete(deleteReview);

export default router;
