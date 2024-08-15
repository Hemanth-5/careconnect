import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

// Description of the message model:
// The message model consists of the following fields:
// sender: The ID of the user who sent the message.
// receiver: The ID of the user who received the message.
// message: The content of the message.
// date: The date the message was sent.
// timestamps: The timestamps for the
