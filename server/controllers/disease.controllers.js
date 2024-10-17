import Disease from "../models/disease.model.js";

// CRUD
// Create
const createDisease = async (req, res) => {
  const disease = new Disease(req.body);

  try {
    await disease.save();
    res.status(201).json(disease);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read
const getDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find();
    res.status(200).json(diseases);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getDisease = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    res.status(200).json(disease);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update
const updateDisease = async (req, res) => {
  try {
    const disease = await Disease.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(disease);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Delete
const deleteDisease = async (req, res) => {
  try {
    await Disease.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Disease deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export { createDisease, getDiseases, getDisease, updateDisease, deleteDisease };
