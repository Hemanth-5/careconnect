import express from "express";
import {
  registerUser,
  loginUser,
  getUserDetails,
  updateUserProfile,
  changePassword,
  updateProfilePicture,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  upload,
  handleUploadErrors,
} from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile picture - use upload.single middleware for file uploads
router.put(
  "/profile-picture",
  authMiddleware,
  upload.single("image"),
  handleUploadErrors,
  updateProfilePicture
);

// Protected routes (authentication required)
router.get("/me", authMiddleware, getUserDetails); // Get current user details (only accessible after login)
router.put("/me", authMiddleware, updateUserProfile); // Update profile
router.put("/me/password", authMiddleware, changePassword); // Change password

export default router;
