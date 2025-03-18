import crypto from "crypto";
import User from "../models/user.model.js"; // Adjust the path if needed

const generateUsername = async (role) => {
  const rolePrefixes = {
    admin: "ADM",
    doctor: "DOC",
    patient: "PAT",
  };

  const prefix = rolePrefixes[role.toLowerCase()] || "USR"; // Default to "USR" if role is unknown

  // Generate a random alphanumeric code (6 characters)
  const randomCode = crypto.randomBytes(3).toString("hex").toUpperCase();

  // Construct the username
  const newUsername = `CC-${prefix}-${randomCode}`;

  // Ensure the username is unique in the database
  const existingUser = await User.findOne({ username: newUsername });
  if (existingUser) {
    return generateUsername(role); // Recursively generate a new one if a conflict occurs
  }

  return newUsername;
};

export default generateUsername;
