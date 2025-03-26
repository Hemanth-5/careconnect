// Necessary imports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Configs
import { connectDB } from "./config/database.js"; // Assuming connectDB function is in this file

// Route imports
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import passwordResetRoutes from "./routes/passwordReset.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/password-reset", passwordResetRoutes);

// Server startup and DB connection
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI); // Wait for DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      // console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1); // Exit process with failure if DB connection fails
  }
};

startServer(); // Call the function to start the server
