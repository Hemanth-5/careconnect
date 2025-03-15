import mongoose from "mongoose";

const specializationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
  },
  { timestamps: true }
);

export default mongoose.model("Specialization", specializationSchema);
