import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import generateUsername from "../utils/generateUsername.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Generate a unique username based on role
    const username = await generateUsername(role);

    // Check if the username or email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already taken." });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT) || 10; // Ensure it's a number
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res
      .status(500)
      .json({ message: "Error creating user.", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT token (for now 1 min)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiry = decoded.exp * 1000; // Convert to milliseconds

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Send token and user info (excluding password)
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ token, user: userObj, expiry });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in.", error: error.message });
  }
};

// Get user details (accessible to users only)
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user details.", error: error.message });
  }
};

// Update user profile (accessible to users only)
export const updateUserProfile = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const updatedUser = await User.findByIdAndUpdate(req.user.userId, data, {
      new: true,
    });

    // console.log("updated", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Change user password (accessible to users only)
export const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const saltRounds = parseInt(process.env.BCRYPT_SALT) || 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user profile picture (accessible to users only)
export const updateProfilePicture = async (req, res) => {
  try {
    const { userId } = req.user;

    // Check if file exists in the request
    if (!req.file && !req.body.image) {
      return res.status(400).json({ message: "No image provided" });
    }

    // console.log(req);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the old profile picture if it exists
    if (user.profilePicture && user.profilePicturePublicId) {
      await deleteImage(user.profilePicturePublicId);
    }

    // Upload the new image
    let uploadResult;
    if (req.file) {
      // If it's a file upload through multer with diskStorage
      uploadResult = await uploadImage(req.file.path);
    } else if (req.body.image) {
      // If it's a base64 string
      uploadResult = await uploadImage(req.body.image);
    }

    // Update user's profile picture info
    user.profilePicture = uploadResult.secure_url;
    user.profilePicturePublicId = uploadResult.public_id;

    await user.save();

    res.json({
      message: "Profile picture updated successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({
      message: "Failed to update profile picture",
      error: error.message,
    });
  }
};
