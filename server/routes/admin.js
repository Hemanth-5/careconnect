import express from "express";
import { createUser, getUsers, getUserById } from "../controllers/admin.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/user", createUser);

export default router;
