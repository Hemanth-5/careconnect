import express from "express";
import {
  registerAdmin,
  registerUser,
  deleteUser,
  getAllUsers,
} from "../controllers/admin.controller.js";
import { adminMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin routes (admin only)
router.post("/register-admin", adminMiddleware, registerAdmin); // Admin only
router.post("/register", adminMiddleware, registerUser); // Admin only
router.delete("/users/:userId", adminMiddleware, deleteUser); // Admin can delete users
router.get("/users", adminMiddleware, getAllUsers); // Admin can get all users

export default router;
