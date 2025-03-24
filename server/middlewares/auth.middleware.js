import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

// Authentication Middleware (for any user)
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Uncomment this to add extra security - ensure user still exists in DB
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token. User not found." });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      fullname: user.fullname, // Include additional user info if needed
    };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Admin Middleware (for Admin only)
export const adminMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {
      if (req.user && req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
      next();
    });
  } catch (error) {
    // If authMiddleware throws error, it will be caught here
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Server error in authentication" });
  }
};

// Doctor Middleware (for Doctor only)
export const doctorMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {
      if (req.user && req.user.role !== "doctor") {
        return res
          .status(403)
          .json({ message: "Access denied. Doctors only." });
      }
      next();
    });
  } catch (error) {
    console.error("Doctor middleware error:", error);
    res.status(500).json({ message: "Server error in authentication" });
  }
};

// Patient Middleware (for Patient only)
export const patientMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {
      if (req.user && req.user.role !== "patient") {
        return res
          .status(403)
          .json({ message: "Access denied. Patients only." });
      }
      next();
    });
  } catch (error) {
    console.error("Patient middleware error:", error);
    res.status(500).json({ message: "Server error in authentication" });
  }
};
