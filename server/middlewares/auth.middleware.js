import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

// Authentication Middleware (for any user)
export const authMiddleware = async (req, res, next) => {
  try {
    // console.log("req.headers", req.headers);
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("token", token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    // console.token("token", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded", decoded);
    // const user = await User.findById(decoded.userId);
    // if (!user) {
    //   return res.status(401).json({ message: "Invalid token." });
    // }

    if (!decoded) {
      res.status(401).json({ message: "Invalid token." });
    }
    // console.log("decoded", decoded);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Admin Middleware (for Admin only)
export const adminMiddleware = async (req, res, next) => {
  await authMiddleware(req, res, () => {}); // Call the authMiddleware first
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Doctor Middleware (for Doctor only)
export const doctorMiddleware = async (req, res, next) => {
  await authMiddleware(req, res, () => {}); // Call the authMiddleware first
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied. Doctors only." });
  }
  next();
};

// Patient Middleware (for Patient only)
export const patientMiddleware = async (req, res, next) => {
  await authMiddleware(req, res, () => {}); // Call the authMiddleware first
  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Access denied. Patients only." });
  }
  next();
};
