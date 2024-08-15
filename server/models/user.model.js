import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "patient", "doctor"],
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    contactInfo: {
      email: {
        type: String,
        validate: {
          validator: function (v) {
            return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
          },
          message: (props) => `${props.value} is not a valid email!`,
        },
        required: true,
      },
      phone: {
        type: String,
        validate: {
          validator: function (v) {
            return /^\d{10}$/.test(v);
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;

// Description of the user model:

// The user model consists of the following fields:
// googleId: The Google ID of the user.
// username: The username of the user.
// password: The password of the user.
// role: The role of the user, which can be "admin", "patient", or "doctor".
// firstName: The first name of the user.
// lastName: The last name of the user.
// contactInfo: An object containing the contact information of the user, including email, phone number, and address.
