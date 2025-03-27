import Appointment from "../models/appointment.model.js";

// Get all appointments for a doctor
const getDoctorAppointments = async (doctorId) => {
  try {
    // Make sure we properly populate the patient field
    return await Appointment.find({ doctor: doctorId })
      .populate({
        path: "patient",
        select: "_id user",
        populate: {
          path: "user",
          select: "fullname email profilePicture username",
        },
      })
      .populate({
        path: "doctor",
        select: "_id user specializations",
        populate: {
          path: "user",
          select: "fullname email profilePicture username",
        },
      })
      .sort({ appointmentDate: -1 });
  } catch (error) {
    console.error("Error in getDoctorAppointments:", error);
    throw new Error(`Error fetching doctor appointments: ${error.message}`);
  }
};

// Get a specific appointment by ID
const getAppointmentById = async (appointmentId) => {
  try {
    return await Appointment.findById(appointmentId)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "username fullname email profilePicture",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "username fullname email profilePicture",
        },
      });
  } catch (error) {
    throw new Error("Error fetching appointment: " + error.message);
  }
};

// Create a new appointment
const createAppointment = async (appointmentData) => {
  try {
    const newAppointment = new Appointment(appointmentData);
    return await newAppointment.save();
  } catch (error) {
    throw new Error("Error creating appointment: " + error.message);
  }
};

// Update an appointment
const updateAppointment = async (appointmentId, updatedData) => {
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return null;
    }

    // Update fields
    Object.keys(updatedData).forEach((key) => {
      appointment[key] = updatedData[key];
    });

    // Add status history if status changed
    if (updatedData.status && updatedData.status !== appointment.status) {
      if (!appointment.statusHistory) {
        appointment.statusHistory = [];
      }

      appointment.statusHistory.push({
        status: updatedData.status,
        changedBy: updatedData.changedBy || "system",
        timestamp: new Date(),
      });
    }

    return await appointment.save();
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

// Get appointment statistics
const getAppointmentStats = async (doctorId, period) => {
  try {
    const today = new Date();
    let startDate;

    // Calculate start date based on period
    switch (period) {
      case "week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case "month":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "year":
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1); // Default to month
    }

    // Get appointments in the period
    const appointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: { $gte: startDate, $lte: today },
    });

    // Calculate statistics
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(
      (a) => a.status === "completed"
    ).length;
    const cancelledAppointments = appointments.filter(
      (a) => a.status === "cancelled"
    ).length;

    return {
      total: totalAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
      pending:
        totalAppointments - completedAppointments - cancelledAppointments,
    };
  } catch (error) {
    throw new Error("Error getting appointment statistics: " + error.message);
  }
};

const AppointmentService = {
  getDoctorAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentStats,
};

export default AppointmentService;
