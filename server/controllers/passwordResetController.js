import crypto from "crypto";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { sendPasswordResetEmail } from "../utils/emailService.js";

const requestPasswordReset = async (req, res) => {
  try {
    console.log("Password reset request received:", req.body);
    const { email } = req.body;

    if (!email) {
      console.log("Email is required but was not provided");
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    console.log("Looking for user with email:", email);
    const user = await User.findOne({ email });

    // For security reasons, always return success even if user doesn't exist
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent",
      });
    }

    console.log("User found, generating reset token");
    // Generate reset token without using the method to avoid validation
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour

    // Use validateBeforeSave: false to bypass validation
    await user.save({ validateBeforeSave: false });

    console.log("Reset token generated:", resetToken);

    // Send the password reset email
    console.log("Sending password reset email");
    await sendPasswordResetEmail(
      email,
      resetToken,
      user.fullname || user.username || user.email
    );
    console.log("Password reset email sent successfully");

    res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({
      message: "Server error during password reset request",
      error: process.env.NODE_ENV === "production" ? null : error.message,
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ message: "Server error during token verification" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update password and clear reset token fields
    // user.password = newPassword;
    // Hash password before saving
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT) || 10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
};

export { requestPasswordReset, verifyToken, resetPassword };
