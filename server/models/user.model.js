import mongoose from "mongoose";

// Model for a general user
const userSchema = new mongoose.Schema(
  {
    username: {
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
    name: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    contact: {
      email: {
        type: String,
        required: true,
        unique: true,
      },
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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
