import express from "express";
import {
  getUsers,
  getUserProfile,
  getUser,
  updateUserProfile,
  updateUser,
  deleteUser,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.route("/").get(getUsers);
router.route("/profile").get(getUserProfile);
router.route("/profile/update").post(updateUserProfile);
router.route("/:id").get(getUser);
router.route("/:id").patch(updateUser);
router.route("/:id").delete(deleteUser);

export default router;
