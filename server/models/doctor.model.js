import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specializations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Specialization" },
    ],
    license: {
      number: { type: String, required: true },
      expirationDate: { type: Date },
    },
    availability: {
      days: [{ type: String }],
      hours: { type: String }, // Example: "9 AM - 5 PM"
    },
    contact: {
      phone: { type: String },
      email: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
