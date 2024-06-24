import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error, "MongoDB failed to connect");
  });
