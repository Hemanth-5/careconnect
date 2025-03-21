import Appointment from "../models/appointment.model.js";

// Get appointment by id
const getAppointmentById = async (appointmentId) => {
  try {
    return await Appointment.findById(appointmentId)
      .populate("patient")
      .populate("doctor");
  } catch (error) {
    throw new Error("Error fetching appointment: " + error.message);
  }
};

// Get appointments by doctor
const getAppointments = async (doctorId) => {
  try {
    return await Appointment.find({ doctor: doctorId })
      .populate("patient")
      .populate("doctor");
  } catch (error) {
    throw new Error("Error fetching appointments: " + error.message);
  }
};

// Create a new appointment
const createAppointment = async (data) => {
  try {
    const newAppointment = new Appointment(data);
    return await newAppointment.save();
  } catch (error) {
    throw new Error("Error creating appointment: " + error.message);
  }
};

// Update an appointment
const updateAppointment = async (appointmentId, updatedData) => {
  try {
    return await Appointment.findByIdAndUpdate(appointmentId, updatedData, {
      new: true,
    });
  } catch (error) {
    throw new Error("Error updating appointment: " + error.message);
  }
};

// Delete an appointment
const deleteAppointment = async (appointmentId) => {
  try {
    return await Appointment.findByIdAndDelete(appointmentId);
  } catch (error) {
    throw new Error("Error deleting appointment: " + error.message);
  }
};

// Get doctor appointments
const getDoctorAppointments = async (doctorId) => {
  try {
    return await Appointment.find({ doctor: doctorId })
      .populate("patient")
      .populate("doctor");
  } catch (error) {
    throw new Error("Error fetching appointments: " + error.message);
  }
};

const AppointmentService = {
  getAppointmentById,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDoctorAppointments,
};

export default AppointmentService;
