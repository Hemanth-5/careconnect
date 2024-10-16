import Doctor from "../models/doctor.model.js";
import Specialization from "../models/specialization.model.js";

// CRUD for Admin
const getSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find();
    res.status(200).json(specializations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSpecialization = async (req, res) => {
  try {
    const specialization = await Specialization.findById(req.params.id);
    if (!specialization) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    res.status(200).json(specialization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSpecialization = async (req, res) => {
  const specialization = new Specialization({
    name: req.body.name,
    description: req.body.description,
    request: { status: "approved" },
  });

  try {
    const newSpecialization = await specialization.save();
    res.status(201).json({ message: "Specialization created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSpecialization = async (req, res) => {
  const updateDetails = req.body;
  try {
    const specialization = await Specialization.findByIdAndUpdate(
      req.params.id,
      updateDetails,
      {
        new: true,
      }
    );

    if (!specialization) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    res.status(200).json({ message: "Specialization updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete specialization by ID
const deleteSpecialization = async (req, res) => {
  try {
    const specialization = await Specialization.findByIdAndDelete(
      req.params.id
    );

    if (!specialization) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    res.status(200).json({ message: "Specialization deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Display pendinf Requests from doctors
const displayPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await Specialization.find({
      "request.status": "pending",
    });
    res.status(200).json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve or Reject a request
const approveOrRejectRequest = async (req, res) => {
  const { status } = req.body;

  // If status is "approved", remove that doctor's request from the Specialization
  if (status === "approved") {
    try {
      const specialization = await Specialization.findByIdAndUpdate(
        req.params.id,
        {
          $unset: { request: null },
        },
        {
          new: true,
        }
      );

      if (!specialization) {
        return res.status(404).json({ message: "Specialization not found" });
      }

      res.status(200).json({ message: "Request approved successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    // If status is "rejected", update the request status
    try {
      const specialization = await Specialization.findByIdAndUpdate(
        req.params.id,
        {
          "request.status": status,
        },
        {
          new: true,
        }
      );

      if (!specialization) {
        return res.status(404).json({ message: "Specialization not found" });
      }

      res.status(200).json({ message: "Request rejected successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// Request from Doctor (creation of a new specialization)
const requestNewSpecialization = async (req, res) => {
  try {
    const userId = req.user.id;
    const doctor = await Doctor.findOne({ userId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const { name, description } = req.body;

    const specialization = new Specialization({
      name,
      description,
      request: { doctorId: doctor._id, status: "pending" },
    });

    await specialization.save();

    res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getSpecializations,
  getSpecialization,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization,
  displayPendingRequests,
  approveOrRejectRequest,
  requestNewSpecialization,
};
