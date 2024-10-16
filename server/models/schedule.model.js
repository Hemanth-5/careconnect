import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
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
    ref: "User", // assuming patient is also a User
  },
});

const scheduleSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming doctor is also a User
      required: true,
    },
    slots: [
      {
        date: {
          type: Date,
          required: true,
        },
        timeSlots: [timeSlotSchema],
      },
    ],
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
