import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      required: true,
    },
    fullName: { type: String },
    profilePicture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
    }, // URL to profile picture
    contact: {
      phone: { type: String },
      address: { type: String },
    },
    lastLogin: { type: Date, default: Date.now },
    refreshToken: { type: String, required: false },
  },
  { timestamps: true }
);

// A function to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
