import Doctor from "../models/doctor.model.js";

// Admin specific functionalities sepcific to doctors
// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId");
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get doctor by ID
const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("userId");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update doctor by ID
const updateDoctor = async (req, res) => {
  const updateDetails = req.body;
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updateDetails,
      {
        new: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete doctor by ID
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Doctor specific functionalities, only for their own purpose
// Display doctor specific details
const displayDoctorInfo = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Regsiter a new doctor
const createDoctor = async (req, res) => {
  try {
    const userId = req.user.id;
    const doctorDetails = req.body;

    // Check if the doctor already exists
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    await Doctor.create({ userId, ...doctorDetails });

    res.status(201).json({ message: "Doctor created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update doctor by themselves
const updateSelf = async (req, res) => {
  const updateDetails = req.body;
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.id },
      updateDetails,
      {
        new: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  displayDoctorInfo,
  createDoctor,
  updateSelf,
};
