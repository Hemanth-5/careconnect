import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Specialization from "../models/specialization.model.js";
import generateUsername from "../utils/generateUsername.js";
import dotenv from "dotenv";

dotenv.config();

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

    const saltRounds = parseInt(process.env.BCRYPT_SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Use a numeric salt rounds value

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

    const saltRounds = parseInt(process.env.BCRYPT_SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Use a numeric salt rounds value

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
      .json({ message: `${role} created successfully.`, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user.", error });
  }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedData = req.body;

    let hashedPassword = updatedData.password;
    if (hashedPassword) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT) || 10;
      hashedPassword = await bcrypt.hash(hashedPassword, saltRounds);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { ...updatedData, password: hashedPassword },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user.", error });
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

    // Delete associated doctor or patient
    await Doctor.findOneAndDelete({ user: userId });
    await Patient.findOneAndDelete({ user: userId });

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
    // Populate their specialization also
    const doctors = await Doctor.find()
      .populate("user")
      .populate("specializations");
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
    const { specializationId } = req.params;

    console.log(`Filtering doctors by specialization: ${specializationId}`);

    // Make sure we handle both string IDs and ObjectId references
    const doctors = await Doctor.find({
      specializations: { $in: [specializationId] },
    })
      .populate("user")
      .populate("specializations");

    console.log(
      `Found ${doctors.length} doctors with specialization ${specializationId}`
    );

    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors by specialization:", error);
    res.status(500).json({ message: "Error fetching doctors.", error });
  }
};

// Update doctor by id
export const updateDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const updatedData = req.body;

    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Update doctor details
    // Only update fields that are provided in the request
    Object.keys(updatedData).forEach((key) => {
      if (key !== "user") {
        // Prevent updating the user reference
        doctor[key] = updatedData[key];
      }
    });

    await doctor.save();

    // If user information is being updated
    if (updatedData.userInfo && doctor.user) {
      const user = await User.findById(doctor.user);
      if (user) {
        // Update user fields except password and role
        const { password, role, ...userUpdateData } = updatedData.userInfo;

        Object.keys(userUpdateData).forEach((key) => {
          user[key] = userUpdateData[key];
        });

        await user.save();
      }
    }

    res.json({ message: "Doctor updated successfully", doctor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating doctor", error: error.message });
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

// Update patient by id
export const updatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const updatedData = req.body;

    // Find the patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Update patient details
    // Only update fields that are provided in the request
    Object.keys(updatedData).forEach((key) => {
      if (key !== "user") {
        // Prevent updating the user reference
        patient[key] = updatedData[key];
      }
    });

    await patient.save();

    // If user information is being updated
    if (updatedData.userInfo && patient.user) {
      const user = await User.findById(patient.user);
      if (user) {
        // Update user fields except password and role
        const { password, role, ...userUpdateData } = updatedData.userInfo;

        Object.keys(userUpdateData).forEach((key) => {
          user[key] = userUpdateData[key];
        });

        await user.save();
      }
    }

    res.json({ message: "Patient updated successfully", patient });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating patient", error: error.message });
  }
};
