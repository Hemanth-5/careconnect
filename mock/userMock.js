import mongoose from "mongoose";
import Mock from "mockjs";

// Schema and model for user and doctor
const UserSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["doctor", "patient"],
    },
    firstName: {
      type: String,
    },
    lastName: {
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
        validate: {
          validator: (value) => /\S+@\S+\.\S+/.test(value), // Email format validation
          message: "Invalid email address",
        },
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
        city: { type: String },
        zipcode: { type: String },
        country: { type: String },
      },
    },
    profilePicture: { type: String },
  },
  { timestamps: true }
);
export const UserModel = mongoose.model("Users", UserSchema);

const DoctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    specialization: [String],
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        year: { type: Number },
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
    },
    experience: {
      totalYears: { type: Number },
      inSpeciality: { type: Number },
    },
  },
  { timestamps: true }
);
export const DoctorModel = mongoose.model("Doctors", DoctorSchema);

// Template for user and doctor
const UserTemplate = {
  "type|1": ["doctor", "patient"],
  firstName: "@first",
  lastName: "@last",
  dateOfBirth: "@date",
  "gender|1": ["male", "female"],
  contact: {
    email: "@email",
    phone: {
      primary: "@integer(1000000000, 9999999999)",
      secondary: "@integer(1000000000, 9999999999)",
    },
    address: {
      city: "@city",
      zipcode: "@zip",
      country: "@country",
    },
  },
  profilePicture: "@image",
};

const DoctorTemplate = {
  userId: () => new mongoose.Types.ObjectId(),
  "specialization|1-3": [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Oncology",
  ],
  "education|1-3": [
    {
      degree: "@word",
      institution: "@company",
      year: "@integer(1980, 2022)",
    },
  ],
  "status|1": ["active", "inactive"],
  experience: {
    totalYears: "@integer(1, 40)",
    inSpeciality: "@integer(0, 40)",
  },
};

// Generate user and doctor data
export const generateUser = () => Mock.mock(UserTemplate);
export const generateDoctor = () => Mock.mock(DoctorTemplate);

// Insert user and doctor data
// const mockUsers = Array.from({ length: 200 }, generateUser);
// console.log("Mock Users", mockUsers);

// const mockDoctors = userIds.map((id) => ({ userId: id, ...generateDoctor() }));
// console.log("Mock Doctors", mockDoctors);
