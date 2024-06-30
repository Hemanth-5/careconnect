import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { OAuth2Client } from "google-auth-library";

import User from "../models/user.model.js";
import Token from "../models/token.model.js";

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

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await Token.create({ userId: user._id, token: refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const { username, email, password, type } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      type,
    });

    await user.save();

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await Token.create({ userId: user._id, token: refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(201).json({
      token,
      user: {
        username: user.username,
        email: user.contact.email,
        type: user.type,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = res.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  try {
    const tokenDoc = await Token.findOne({ token: refreshToken });

    if (!tokenDoc) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "User not authenticated" });
      }

      const accessToken = generateAccessToken(user);
      res.status(200).json({ token: accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google Login
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      const newUser = new User({
        googleId: payload.sub,
        username: payload.name,
        email: payload.email,
        // Generate random password
        password: bcrypt.hashSync(Math.random().toString(36).slice(-8), 10),
        type: "patient",
        profilePicture: payload.picture,
      });

      await newUser.save();
      user = newUser;
    }

    const accesstoken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await Token.create({ userId: user._id, token: refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(201).json({
      token: accesstoken,
      user: {
        username: user.username,
        email: user.contact.email,
        type: user.type,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { login, register, refreshAccessToken, googleLogin };
