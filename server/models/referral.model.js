import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
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
    reason: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Referral = mongoose.model("Referral", referralSchema);

export default Referral;

// Description of the referral model:
// The referral model consists of the following fields:
// doctorId: The ID of the doctor who is referring the patient.
// patientId: The ID of the patient being referred.
// reason: The reason for the referral.
// date: The date the referral was made.
// timestamps: The timestamps for the referral model.
