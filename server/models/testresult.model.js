import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
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
    },
  },
  { timestamps: true }
);

const TestResult = mongoose.model("TestResult", testResultSchema);

export default TestResult;

// Description of the test result model:
// The test result model consists of the following fields:
// testId: The ID of the lab test for which the result is generated.
// result: The result of the lab test (positive, negative, inconclusive).
// interpretation: The interpretation or analysis of the lab test result.
// date: The date the test result was generated.
// timestamps: The timestamps for the test result model.
