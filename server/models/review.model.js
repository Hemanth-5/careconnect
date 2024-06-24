import mongoose from "mongoose";

// Model for a review
// Patient can rate and review about a doctor
const ReviewSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "Doctors",
    },
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "Patients",
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Reviews = mongoose.model("Reviews", ReviewSchema);

export default Reviews;
