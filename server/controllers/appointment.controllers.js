import Appointment from "../models/appointment.model.js";

// Admin Specific
// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id);
    res.status(200).json(appointment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create an appointment
const createAppointment = async (req, res) => {
  const appointment = req.body;
  const newAppointment = new Appointment(appointment);
  try {
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Update an appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const appointment = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No appointment with id: ${id}`);
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    id,
    appointment,
    {
      new: true,
    }
  );
  res.json(updatedAppointment);
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No appointment with id: ${id}`);
  await Appointment.findByIdAndRemove(id);
  res.json({ message: "Appointment deleted successfully." });
};

// Doctor Specific
// Get appointments for that doctor, ie pending
const getDoctorAppointments = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const appointments = await Appointment.find({
      doctorId,
      status: "pending",
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Confirm an appointment
const confirmAppointment = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No appointment with id: ${id}`);
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
    }
  );
  res.json(updatedAppointment);
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No appointment with id: ${id}`);
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
    }
  );
  res.json(updatedAppointment);
};

// Patient Specific
// Get appointments for that patient
const getPatientAppointments = async (req, res) => {
  const { patientId } = req.params;
  try {
    const appointments = await Appointment.find({ patientId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDoctorAppointments,
  confirmAppointment,
  cancelAppointment,
  getPatientAppointments,
};
