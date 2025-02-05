import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to User
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["appointment", "prescription", "alert"],
    required: true,
  }, // Types of notifications
  readStatus: { type: Boolean, default: false }, // To track whether the user has seen the notification
  createdAt: { type: Date, default: Date.now },
  scheduledFor: { type: Date }, // For future scheduled notifications
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
