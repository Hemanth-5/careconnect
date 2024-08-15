import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
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
    },
    departments: [
      {
        name: {
          type: String,
          required: true,
        },
        description: String,
      },
    ],
  },
  { timestamps: true }
);

const Facility = mongoose.model("Facility", facilitySchema);

export default Facility;

// Description of the facility model:
// The facility model consists of the following fields:
// name: The name of the facility.
// address: The address of the facility, including street, city, state, zipcode, and country.
// contactInfo: The contact information of the facility, including email and phone number.
// departments: An array of departments within the facility, each containing a name and description.
// timestamps: The timestamps for the facility model.
