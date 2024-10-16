import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  updateUserProfilePic,
} from "../controllers/user.controllers.js";
import { authenticateJWT, verifyAdmin } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// All routes
router.route("/profile").get(authenticateJWT, getProfile);
router.route("/profile/update").put(authenticateJWT, updateProfile);
router
  .route("/profile/updatepic")
  .put(authenticateJWT, upload.single("file"), updateUserProfilePic);

router.route("/").get(authenticateJWT, verifyAdmin, getUsers);
router
  .route("/:id")
  .get(authenticateJWT, verifyAdmin, getUser)
  .put(authenticateJWT, verifyAdmin, updateUser)
  .delete(authenticateJWT, verifyAdmin, deleteUser);

export default router;
