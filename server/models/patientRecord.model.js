import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
  },
  mimeType: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const recordEntrySchema = new mongoose.Schema({
  recordType: {
    type: String,
    enum: [
      "examination",
      "test",
      "procedure",
      "consultation",
      "follow-up",
      "other",
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  diagnosis: {
    type: String,
  },
  findings: {
    type: String,
  },
  treatment: {
    type: String,
  },
  treatmentProgress: {
    type: String,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  attachments: [
    {
      filename: String,
      url: String,
      contentType: String,
    },
  ],
});

const PatientRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    records: [recordEntrySchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for improving query performance
PatientRecordSchema.index({ patient: 1 });
PatientRecordSchema.index({ doctor: 1 });
PatientRecordSchema.index({ createdAt: -1 });
PatientRecordSchema.index({ "records.recordType": 1 });

const PatientRecord = mongoose.model("PatientRecord", PatientRecordSchema);

export default PatientRecord;
