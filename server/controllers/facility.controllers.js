import Facility from "../models/facility.model.js";

// CRUD for admin
// Get all facilities
const getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.status(200).json(facilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a facility by id
const getFacilityById = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    res.status(200).json(facility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new facility
const createFacility = async (req, res) => {
  const facility = new Facility(req.body);
  try {
    await facility.save();
    res.status(201).json({ message: "Facility created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a facility by id
const updateFacility = async (req, res) => {
  try {
    await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Facility updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a facility by id
const deleteFacility = async (req, res) => {
  try {
    await Facility.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Facility deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
};
