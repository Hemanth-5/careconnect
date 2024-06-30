import mongoose from "mongoose";

// Model for a general user
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
    },
    // Either username or email are required
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    contact: {
      phone: {
        primary: {
          type: String,
        },
        secondary: {
          type: String,
        },
      },
      address: {
        city: {
          type: String,
        },
        zipcode: {
          type: String,
        },
      },
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
