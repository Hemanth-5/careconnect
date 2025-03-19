import dotenv from "dotenv";

dotenv.config();

const config = {
  // Server configuration
  port: process.env.PORT || 5000,

  // MongoDB URI
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/careconnect",

  // JWT Config
  jwtSecret: process.env.JWT_SECRET || "your-jwt-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  refreshTokenSecret:
    process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  // Frontend URL for links in emails
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  // Email config (in addition to ones in emailService.js)
  emailEnabled: process.env.EMAIL_ENABLED === "true" || false,
};

export default config;
