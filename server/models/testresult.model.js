import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test", // Assuming you have a Test schema
      required: true,
    },
    result: {
      type: String,
      required: true,
      enum: ["positive", "negative", "inconclusive"],
    },
    interpretation: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const TestResult = mongoose.model("TestResult", testResultSchema);

export default TestResult;
