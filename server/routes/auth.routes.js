import express from "express";
import {
  login,
  register,
  refreshAccessToken,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/token").post(refreshAccessToken);

export default router;
