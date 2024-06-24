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
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    contact: {
      email: {
        type: String,
        required: true,
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
