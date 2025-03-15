import express from "express";
import {
  registerUser,
  deleteUser,
  getAllUsers,
} from "../controllers/user.controller.js";
import { adminMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin routes (admin only)
router.post("/register", adminMiddleware, registerUser); // Admin only
router.delete("/:userId", adminMiddleware, deleteUser); // Admin can delete users
router.get("/", adminMiddleware, getAllUsers); // Admin can get all users

export default router;
