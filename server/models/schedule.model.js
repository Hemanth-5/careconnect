import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    slots: [
      {
        date: {
          type: Date,
          required: true,
        },
        timeSlots: [
          {
            time: {
              type: String,
              required: true,
            },
            status: {
              type: String,
              enum: ["available", "booked"],
              default: "available",
            },
            patientId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Patient",
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;

// Description of the schedule model:
// The schedule model consists of the following fields:
// doctorId: The ID of the doctor for whom the schedule is created.
// slots: An array of date and time slots for the doctor's availability.
