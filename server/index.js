// Import necessary modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";

// Import configs
import connectDB from "./config/db.js";

dotenv.config();

// App config
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

// API endpoints

// Connect to MongoDB
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err, "Error connecting to MongoDB");
  });
