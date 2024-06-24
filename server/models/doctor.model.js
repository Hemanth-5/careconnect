import mongoose from "mongoose";

// Model for a doctor
const DoctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    specialization: {
      type: [String],
      required: true,
    },
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
    },
    experience: {
      totalYears: Number,
      inSpeciality: Number,
    },
    schedule: {
      monday: { start: String, end: String },
      tuesday: { start: String, end: String },
      wednesday: { start: String, end: String },
      thursday: { start: String, end: String },
      friday: { start: String, end: String },
      saturday: { start: String, end: String },
    },
    languages: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    memberships: {
      type: [String],
      default: [],
    },
    awards: {
      type: [String],
      default: [],
    },
    researchInterests: {
      type: [String],
      default: [],
    },
    reviews: [
      {
        // Reviews can be accessed from Reviews model
        type: mongoose.Types.ObjectId,
        ref: "Reviews",
      },
    ],
  },
  { timestamps: true }
);

const Doctors = mongoose.model("Doctors", DoctorSchema);

export default Doctors;
