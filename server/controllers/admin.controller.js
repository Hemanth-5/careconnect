import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
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
