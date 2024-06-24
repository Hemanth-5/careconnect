import mongoose from "mongoose";

// Model for a prescription
// Prescription contains the details of the medicine prescribed by the doctor
const PrescriptionSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "Doctors",
    },
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "Patients",
    },
    // Choose medicine from the list of medicines
    medicines: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Medicines",
      },
    ],
  },
  { timestamps: true }
);

const Prescriptions = mongoose.model("Prescriptions", PrescriptionSchema);

export default Prescriptions;
