import express from "express";
import {
  loginUser,
  getUserDetails,
  updateUserProfile,
  changePassword,
  refreshToken,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken); // For generating a new access token using refresh token

// Protected routes (authentication required)
router.get("/me", authMiddleware, getUserDetails); // Get current user details (only accessible after login)
router.put("/me", authMiddleware, updateUserProfile); // Update profile
router.put("/me/password", authMiddleware, changePassword); // Change password

export default router;
