import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Specialization from "../models/specialization.model.js";
import generateUsername from "../utils/generateUsername.js";

// Register a new admin user
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Generate a unique username for admin
    const username = await generateUsername("admin");

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Use a numeric salt rounds value

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "Admin user created successfully.", username });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin user.", error });
  }
};

// Register a new user (Admin only can create users)
export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Generate a unique username based on role
    const username = await generateUsername(role);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Use a numeric salt rounds value

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Add doctor / patient to the database
    if (role === "doctor") {
      // Add doctor details
      const doctor = new Doctor({
        user: newUser._id,
      });
      await doctor.save();
    } else if (role === "patient") {
      // Add patient details
      const patient = new Patient({
        user: newUser._id,
      });
      await patient.save();
    }

    res
      .status(201)
      .json({ message: `${role} created successfully.`, username });
  } catch (error) {
    res.status(500).json({ message: "Error registering user.", error });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// User list (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create specializations (Admin only)
export const createSpecialization = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Specialization.findOne({
      name: { $regex: new RegExp(name, "i") },
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Specialization already exists." });
    }

    const newSpecialization = new Specialization({ name, description });
    await newSpecialization.save();

    res.json({ message: "Specialization created successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error creating specialization.", error });
  }
};

// Get all specializations
export const getSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find();
    res.json(specializations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching specializations.", error });
  }
};

// Update specialization (Admin only)
export const updateSpecialization = async (req, res) => {
  try {
    const { specializationId } = req.params;
    const updatedData = req.body;

    const specialization = await Specialization.findByIdAndUpdate(
      specializationId,
      updatedData,
      {
        new: true,
      }
    );
    if (!specialization) {
      return res.status(404).json({ message: "Specialization not found." });
    }

    res.json(specialization);
  } catch (error) {
    res.status(500).json({ message: "Error updating specialization.", error });
  }
};

// Delete specialization (Admin only)
export const deleteSpecialization = async (req, res) => {
  try {
    const { specializationId } = req.params;

    // Find and delete the specialization
    const specialization = await Specialization.findByIdAndDelete(
      specializationId
    );

    if (!specialization) {
      return res.status(404).json({ message: "Specialization not found." });
    }

    // Find all doctors with this specialization
    const doctorsWithSpecialization = await Doctor.find({
      specializations: specializationId,
    });

    // Update each doctor to remove the deleted specialization
    for (const doctor of doctorsWithSpecialization) {
      doctor.specializations = doctor.specializations.filter(
        (id) => id.toString() !== specializationId
      );
      await doctor.save(); // Await each save operation
    }

    res.json({ message: "Specialization deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting specialization.", error });
  }
};

// Doctors
// Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors.", error });
  }
};

// Get doctor by id
export const getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId).populate("user");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor.", error });
  }
};

// Get doctor by specialization
export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    const doctors = await Doctor.find({ specialization }).populate("user");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors.", error });
  }
};

// Patients
// Get all patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("user");
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients.", error });
  }
};

// Get patient by id
export const getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId).populate("user");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient.", error });
  }
};
