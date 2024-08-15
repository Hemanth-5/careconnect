import mongoose from "mongoose";

const specializationSchema = new mongoose.Schema({
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

const Specialization = mongoose.model("Specialization", specializationSchema);

export default Specialization;

// Description of the specialization model:
// The specialization model consists of the following fields:
// name: The name of the specialization.
// description: A description of the specialization.
