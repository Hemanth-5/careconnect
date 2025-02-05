const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date },
    profilePic: { type: String }, // URL to profile picture
    googleId: { type: String }, // For Google OAuth
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    permissions: { type: Map, of: Boolean }, // Stores specific permissions for roles
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
