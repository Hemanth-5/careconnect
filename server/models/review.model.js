import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;

// Description of the review model:
// The review model consists of the following fields:
// doctorId: The ID of the doctor who is being reviewed.
// patientId: The ID of the patient who is writing the review.
// rating: The rating given by the patient to the doctor.
// comment: The comment or feedback provided by the patient.
// date: The date the review was submitted.
// timestamps: The timestamps for the review model.