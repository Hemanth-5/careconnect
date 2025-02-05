const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  permissions: [String], // List of admin permissions
  activityLogs: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now },
      performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  managedDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
  managedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
});

module.exports = mongoose.model("Admin", adminSchema);
