import nodemailer from "nodemailer";
import dotenv from "dotenv";
import config from "../config/config.js";

dotenv.config();

// Create reusable transporter
const createTransporter = async () => {
  // Use environment variables for configuration
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT);
  const secure = process.env.EMAIL_SECURE === "true";
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  // For development, use a test account if credentials not provided
  if (!host || !user || !pass) {
    // console.log("Email credentials not found, using test account...");
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Create production-ready transporter
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token, name, resetUrl) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"CareConnect Support" <${
        process.env.EMAIL_FROM || "support@careconnect.com"
      }>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3498db;">CareConnect Password Reset</h2>
          <p>Hello ${name || "there"},</p>
          <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
          <p>To reset your password, click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p>${resetUrl}</p>
          <p>Thank you,<br>The CareConnect Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    // Log preview URL for development (ethereal.email)
    if (info.messageId && !process.env.EMAIL_HOST) {
      // console.log(
      //   "Password reset email preview URL:",
      //   nodemailer.getTestMessageUrl(info)
      // );
    }

    return info;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// Send notification email (e.g., for appointment confirmations)
export const sendNotificationEmail = async (recipient, subject, content) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"CareConnect Notifications" <${
        process.env.EMAIL_FROM || "notifications@careconnect.com"
      }>`,
      to: recipient.email,
      subject: subject,
      html: content,
    };

    const info = await transporter.sendMail(mailOptions);

    // Log preview URL for development (ethereal.email)
    if (info.messageId && !process.env.EMAIL_HOST) {
      // console.log(
      //   "Notification email preview URL:",
      //   nodemailer.getTestMessageUrl(info)
      // );
    }

    return info;
  } catch (error) {
    console.error("Error sending notification email:", error);
    throw error;
  }
};
