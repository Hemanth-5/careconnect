import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

// Description of the notification model:
// The notification model consists of the following fields:
// userId: The ID of the user associated with the notification.
// type: The type of notification (e.g., appointment, message, report).
// message: The content of the notification.
// read: A boolean flag indicating whether the notification has been read.
