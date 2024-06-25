import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

const login = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Try finding user with either email or username in contact object
    const user = await User.findOne({
      $or: [{ "contact.email": email }, { username }],
    });

    // If user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, type: user.type },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const { username, password, email, type } = req.body;

  // Check if user exists
  try {
    const userExists = await User.findOne({
      $or: [{ username }, { "contact.email": email }],
    });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // If new user
    // Create hashed pwd
    const hashedPassword = await bcryptjs.hash(password, 10);
  } catch (error) {}
};

export { login, register };
