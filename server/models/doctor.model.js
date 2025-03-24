import mongoose from "mongoose";

const availabilitySlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  startTime: { type: String },
  endTime: { type: String },
  isAvailable: { type: Boolean, default: true },
});

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specializations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Specialization" },
    ],
    license: {
      number: { type: String },
      expirationDate: { type: Date },
    },
    experience: { type: Number }, // Years of experience
    education: { type: String }, // Educational qualifications
    // Changed from availability.days and availability.hours to a more structured approach
    availability: [availabilitySlotSchema],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    exhaustedAppointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    patientsUnderCare: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    prescriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
    issuedReports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalReport",
      },
    ],
    // Added ratings and reviews for potential future feature
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    reviews: [
      {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
        rating: { type: Number },
        comment: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    consultationFee: { type: Number },
    bio: { type: String },
    // Added specializationIds to handle the case in DoctorsList.js
    specializationIds: [{ type: mongoose.Schema.Types.ObjectId }],
    // Check if the records field is properly defined in your schema
    records: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PatientRecord",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
