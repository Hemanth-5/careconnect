import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    sideEffects: {
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
    quantity: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Medication = mongoose.model("Medication", medicationSchema);

export default Medication;

// Description of the medication model:
// The medication model consists of the following fields:
// name: The name of the medication.
// description: A description of the medication.
// sideEffects: The side effects of the medication.
// dosage: The dosage information for the medication.
// price: The price of the medication.
// quantity: The quantity of the medication in stock.
// imageUrl: The URL of the image associated with the medication.
// timestamps: The timestamps for the medication model.
// The medication model represents the medications available in the system, including their details such as name, description, side effects, dosage, price, quantity, and image URL. This model is used to manage the medication inventory and provide information about each medication to users
