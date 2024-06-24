import Doctors from "../models/Doctors.js";
import Users from "../models/Users.js";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctors.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Failed to get doctors" });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctors.findById(id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: "Failed to get doctor" });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const doctor = await Doctors.create({ userId: id, ...req.body });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: "Failed to create doctor" });
  }
};
