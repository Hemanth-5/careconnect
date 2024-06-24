import mongoose from "mongoose";

// Model for a medicine
// Contains the details of a medicine
const MedicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Medicines = mongoose.model("Medicines", MedicineSchema);

export default Medicines;
