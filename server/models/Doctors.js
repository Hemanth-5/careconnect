import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    specialization: [String],
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    status: String,
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
    languages: [String],
    certifications: [String],
    memberships: [String],
    awards: [String],
    researchInterests: [String],
    reviews: [
      {
        patientId: {
          type: mongoose.Types.ObjectId,
          ref: "Patients",
        },
        rating: Number,
        comments: String,
      },
    ],
  },
  { timestamps: true }
);

const Doctors = mongoose.model("Doctors", DoctorSchema);
export default Doctors;
