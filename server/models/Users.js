import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["admin", "doctor", "patient"],
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dateOfBirth: Date,
    gender: String,
    contact: {
      email: {
        type: String,
        validate: {
          validator: (value) => /\S+@\S+\.\S+/.test(value), // Email format validation
          message: "Invalid email address",
        },
      },
      phone: {
        primary: {
          type: String,
        },
        secondary: String,
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
      },
    },
    profilePicture: String,
  },
  { timestamps: true }
);

export const Users = mongoose.model("Users", UserSchema);
export default Users;
