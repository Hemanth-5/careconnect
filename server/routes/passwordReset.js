import express from "express";
import {
  requestPasswordReset,
  verifyToken,
  resetPassword,
} from "../controllers/passwordResetController.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";

const router = express.Router();

// Simple test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "Password reset API is working" });
});

// Test email endpoint
router.get("/test-email", async (req, res) => {
  try {
    const result = await sendPasswordResetEmail(
      "test@example.com",
      "test-token-123",
      "Test User"
    );
    res.json({ success: true, result });
  } catch (error) {
    console.error("Email test error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  }
});

// Request password reset (send email with token)
router.post("/request", requestPasswordReset);

// Verify token validity (optional - for frontend to check if token is valid before showing reset form)
router.get("/verify-token/:token", verifyToken);

// Verify token and reset password
router.post("/reset", resetPassword);

export default router;
