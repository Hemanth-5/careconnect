import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import User from "../models/user.model.js";

// Get all appointments (Admin)
export const getAllAppointments = async (req, res) => {
  try {
    const { status, doctorId, patientId, startDate, endDate } = req.query;

    // Build filter object based on query parameters
    const filter = {};

    if (status) filter.status = status;
    if (doctorId) filter.doctor = doctorId;
    if (patientId) filter.patient = patientId;

    // Date range filtering
    if (startDate || endDate) {
      filter.appointmentDate = {};
      if (startDate) filter.appointmentDate.$gte = new Date(startDate);
      if (endDate) filter.appointmentDate.$lte = new Date(endDate);
    }

    // Get appointments with populated references
    const appointments = await Appointment.find(filter)
      .populate({
        path: "doctor",
        populate: { path: "user", select: "username fullname email" },
      })
      .populate({
        path: "patient",
        populate: { path: "user", select: "username fullname email" },
      })
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate({
        path: "doctor",
        populate: { path: "user", select: "username fullname email" },
      })
      .populate({
        path: "patient",
        populate: { path: "user", select: "username fullname email" },
      });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointment details",
      error: error.message,
    });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update status
    appointment.status = status;

    // Add notes if provided
    if (notes) {
      appointment.notes = notes;
    }

    // Add status history
    appointment.statusHistory.push({
      status,
      changedBy: req.user._id,
      notes: notes || undefined,
      timestamp: new Date(),
    });

    await appointment.save();

    res.json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating appointment", error: error.message });
  }
};

// Get analytics data
export const getAppointmentAnalytics = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;

    let start, end;

    // Set date range based on period
    if (period === "week") {
      start = new Date();
      start.setDate(start.getDate() - 7);
      end = new Date();
    } else if (period === "month") {
      start = new Date();
      start.setMonth(start.getMonth() - 1);
      end = new Date();
    } else if (period === "year") {
      start = new Date();
      start.setFullYear(start.getFullYear() - 1);
      end = new Date();
    } else if (startDate && endDate) {
      // Custom date range
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default to last 30 days
      start = new Date();
      start.setDate(start.getDate() - 30);
      end = new Date();
    }

    // Total appointments count
    const totalAppointments = await Appointment.countDocuments({
      appointmentDate: { $gte: start, $lte: end },
    });

    // Get count by status
    const appointmentsByStatus = await Appointment.aggregate([
      {
        $match: { appointmentDate: { $gte: start, $lte: end } },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Top doctors
    const topDoctors = await Appointment.aggregate([
      {
        $match: { appointmentDate: { $gte: start, $lte: end } },
      },
      {
        $group: {
          _id: "$doctor",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctorDetails",
        },
      },
      {
        $unwind: "$doctorDetails",
      },
      {
        $lookup: {
          from: "users",
          localField: "doctorDetails.user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 1,
          count: 1,
          doctorName: "$userDetails.fullname",
          username: "$userDetails.username",
        },
      },
    ]);

    // Appointments by day
    const appointmentsByDay = await Appointment.aggregate([
      {
        $match: { appointmentDate: { $gte: start, $lte: end } },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      totalAppointments,
      appointmentsByStatus,
      topDoctors,
      appointmentsByDay,
      dateRange: { start, end },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching analytics data", error: error.message });
  }
};
