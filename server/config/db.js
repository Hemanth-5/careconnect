import mongoose from "mongoose";

const connectDB = async (url) => {
  const connection = mongoose.connect(url);

  connection.then(() => {
    console.log("MongoDB connected successfully");
  });
};

export default connectDB;
