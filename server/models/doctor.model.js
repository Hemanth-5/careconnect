import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialization",
      // required: true,
    },
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    certification: [String],
    schedule: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        time: {
          start: String,
          end: String,
        },
      },
    ],
    languages: [String],
    experience: {
      totalYears: Number,
      inSpecialization: Number,
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;

// Description of the doctor model:

// The doctor model consists of the following fields:
// userId: The ID of the user associated with the doctor.
// specialization: The ID of the specialization associated with the doctor.
// education: An array of objects containing the degree, institution, and year of education for the doctor.
// certification: An array of certifications obtained by the doctor.
// schedule: An array of objects containing the day and time schedule for the doctor.
// languages: An array of languages spoken by the doctor.
// experience: An object containing the total years of experience and years of experience in the specialization for the doctor.
// facilityId: The ID of the facility associated with the doctor.

// The doctor model is defined using Mongoose schema and exported as the Doctor model. The schema includes the following fields:
// userId: A reference to the User model, representing the user associated with the doctor.
// specialization: A reference to the Specialization model, representing the specialization associated with the doctor.
// education: An array of objects containing the degree, institution, and year fields.
// certification: An array of strings representing certifications obtained by the doctor.
// schedule: An array of objects containing the day and time fields.
// languages: An array of strings representing languages spoken by the doctor.
// experience: An object containing the totalYears and inSpecialization fields.
// facilityId: A reference to the Facility model, representing the facility associated with the doctor.

// The timestamps option is set to true to automatically add createdAt and updatedAt fields to the doctor
