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
    const saltRounds = parseInt(process.env.BCRYPT_SALT) || 11; // Ensure it's a number
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

    // Generate Access Token (valid for 1 hour)
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Check if the user already has a valid refresh token
    let refreshToken = user.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        // If valid, reuse the same refresh token
      } catch (error) {
        // If expired or invalid, generate a new refresh token
        refreshToken = jwt.sign(
          { userId: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );
      }
    } else {
      // If no refresh token exists, create one
      refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
    }

    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    // Send both tokens to the client
    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Error logging in.", error });
  }
};

// Get user details (accessible to users only)
export const getUserDetails = async (req, res) => {
  // console.log(req.user);
  try {
    const user = await User.findById(req.user.userId);
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details.", error });
  }
};

// Update user profile (accessible to users only)
export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, contact } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { fullName, contact },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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

    const isMatch = await user.comparePassword(oldPassword); // Assuming `comparePassword` is a method in the User model to compare passwords
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // console.log(user);
    // Hash the new password
    const saltRounds = parseInt(process.env.BCRYPT_SALT) || 11; // Ensure it's a number
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    // console.log(hashedPassword);

    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Find user by decoded token
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Refresh token does not match" });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken });
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the old profile picture from Cloudinary if it exists
    if (user.profilePicture && user.profilePicture.publicId) {
      await deleteImage(user.profilePicture.publicId);
    }

    // Upload the new image to Cloudinary
    let uploadResult;
    if (req.file) {
      // If it's a file upload through multer with memoryStorage
      // Create a base64 string from buffer
      const base64String = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
      uploadResult = await uploadImage(base64String);
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
