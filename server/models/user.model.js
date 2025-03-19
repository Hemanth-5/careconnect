import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: { type: String },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer not to say"],
    },
    dateOfBirth: { type: Date },
    age: { type: Number },
    profilePicture: { type: String },
    contact: contactSchema,
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
