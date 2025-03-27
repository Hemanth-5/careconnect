import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";

// Request a password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Don't reveal if user exists or not for security reasons
    if (!user) {
      return res.status(200).json({
        message:
          "If an account with that email exists, we've sent a password reset link",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); // Token valid for 1 hour

    // Save token to user record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();

    // console.log(user);

    // Send password reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(
      user.email,
      resetToken,
      user.fullname || user.username,
      resetUrl
    );

    res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({
      message: "Error processing password reset",
      error: error.message,
    });
  }
};

// Verify reset token
export const verifyToken = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        valid: false,
        message: "Password reset token is invalid or has expired",
      });
    }

    res.status(200).json({
      valid: true,
      message: "Token is valid",
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      valid: false,
      message: "Error verifying token",
      error: error.message,
    });
  }
};

// Reset password with token
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset token is invalid or has expired",
      });
    }

    // Hash the new password
    const saltRounds = parseInt(process.env.BCRYPT_SALT) || 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};
