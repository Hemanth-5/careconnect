// Import necessary modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "./config/auth.js";

// Import configs
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import specializationRoutes from "./routes/specialization.routes.js";
import facilityRoutes from "./routes/facility.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import diseaseRoutes from "./routes/disease.routes.js";

dotenv.config();

// App config
const app = express();

// Inbuilt Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

// API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/v2/users", userRoutes);
app.use("/api/v2/patients", patientRoutes);
app.use("/api/v2/doctors", doctorRoutes);
app.use("/api/v2/specializations", specializationRoutes);
app.use("/api/v2/facilities", facilityRoutes);
app.use("/api/v2/appointments", appointmentRoutes);
app.use("/api/v2/diseases", diseaseRoutes);

// Connect to MongoDB
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err, "Error connecting to MongoDB");
  });
