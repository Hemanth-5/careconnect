import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Authentication Middleware (for any user)
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token." });
    }

    req.user = user; // Attach the user object to the request
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
