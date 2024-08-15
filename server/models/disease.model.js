import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Disease = mongoose.model("Disease", diseaseSchema);

export default Disease;

// Description of the disease model:
// The disease model consists of the following fields:
// name: The name of the disease.
// description: A description of the disease.
