import nodemailer from "nodemailer";
import config from "../config/config.js";

// Create reusable transporter using environment variables
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-email-password",
  },
});

/**
 * Send password reset email
 * @param {string} to Recipient email
 * @param {string} resetToken Reset token
 * @param {string} username User's name or email
 */
export const sendPasswordResetEmail = async (to, resetToken, username) => {
  // Frontend reset URL
  const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;

  const mailOptions = {
    from:
      process.env.EMAIL_FROM ||
      '"CareConnect Support" <support@careconnect.com>',
    to,
    subject: "CareConnect Password Reset",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a90e2;">Password Reset Request</h2>
        <p>Hello ${username || "there"},</p>
        <p>We received a request to reset your password for your CareConnect account. 
           To reset your password, click the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4a90e2; color: white; padding: 12px 20px; 
                    text-decoration: none; border-radius: 4px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        
        <p>If you didn't request this password reset, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        
        <p>Thank you,<br>The CareConnect Team</p>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p>${resetUrl}</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send password reset email");
  }
};

// Add additional email utility functions if needed
