import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicalHistory: {
      bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
      weight: Number,
      height: Number,
      allergies: [{ type: String }],
      currentMedications: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Medication" },
      ],
      chronicDiseases: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Disease" },
      ],
    },
    emergencyContacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmergencyContact",
      },
    ],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    prescriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
    preferredDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;

// Description of the patient model:

// The patient model consists of the following fields:
// userId: The ID of the user associated with the patient.
// medicalHistory: An object containing the medical history of the patient, including blood group, weight, height, allergies, current medications, and chronic diseases.
// emergencyContacts: An array of emergency contacts associated with the patient.
// appointments: An array of appointments associated with the patient.
// prescriptions: An array of prescriptions associated with the patient.
// preferredDoctor: The ID of the preferred doctor for the patient.

// The patient model is defined using Mongoose schema and exported as the Patient model. The schema includes the following fields:
// userId: A reference to the User model, representing the user associated with the patient.
// medicalHistory: An object containing subfields for blood group, weight, height, allergies, current medications, and chronic diseases.
// emergencyContacts: An array of references to the EmergencyContact model, representing the emergency contacts associated with the patient.
// appointments: An array of references to the Appointment model, representing the appointments associated with the patient.
// prescriptions: An array of references to the Prescription model, representing the prescriptions associated with the patient.
// preferredDoctor: A reference to the Doctor model, representing the preferred doctor for the patient.

// The timestamps option is set to true to automatically add createdAt and updatedAt fields to the schema.
