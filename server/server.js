import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

// DB Connection
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import reportRoutes from "./routes/report.routes.js";
import labTestRoutes from "./routes/labtest.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";
import reviewRoutes from "./routes/review.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoutes);
app.use("/api/v2/users", userRoutes);
app.use("/api/v2/doctors", doctorRoutes);
app.use("/api/v2/patients", patientRoutes);
app.use("/api/v2/appointments", appointmentRoutes);
app.use("/api/v2/prescriptions", prescriptionRoutes);
app.use("/api/v2/reports", reportRoutes);
app.use("/api/v2/labtests", labTestRoutes);
app.use("/api/v2/medicines", medicineRoutes);
app.use("/api/v2/reviews", reviewRoutes);

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error, "MongoDB failed to connect");
  });
