import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { OAuth2Client } from "google-auth-library";

import adminRoutes from "./routes/admin.js";
import doctorRoutes from "./routes/doctor.js";
import authRoutes from "./routes/auth.js";
// import { ClientSession } from "mongodb";
// ClientSession;

// Configurations
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Add this line
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

// MongoDB setup
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    bufferCommands: false,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
  })
  .catch((error) => console.log(error, "MongoDB failed to connect"));

// Routes
app.use("/", adminRoutes);
app.use("/doctors", doctorRoutes);
app.use("/api/auth", authRoutes);
