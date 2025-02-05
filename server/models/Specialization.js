const mongoose = require("mongoose");

const specializationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Specialization", specializationSchema);

module.exports = mongoose.model("Specialization", specializationSchema);
