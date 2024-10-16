import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the header

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Check if the error is because of token expiration
      if (err.name === "TokenExpiredError") {
        return res
          .status(403)
          .json({ message: "Token expired", expiredAt: err.expiredAt });
      }
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

const verifyDoctor = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "doctor") {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

export { authenticateJWT, verifyAdmin, verifyDoctor };
