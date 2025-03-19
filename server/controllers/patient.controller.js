import NotificationService from "../services/notification.service.js";
import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import Prescription from "../models/prescription.model.js";

// Get patient's profile details
export const getPatientDetails = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.userId }).populate(
      "user"
    );
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient details.", error });
  }
};

// Update patient's profile details
export const updatePatientProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const updatedData = req.body;
    // console.log("updatedData", updatedData);
    const patient = await Patient.findOneAndUpdate(
      { user: userId },
      updatedData,
      {
        new: true,
      }
    );

    await patient.save();
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// // Schedule an appointment
// export const scheduleAppointment = async (req, res) => {
//   try {
//     const { patientId, doctorId, date, timeSlot, reason } = req.body;
//     const appointment = await AppointmentService.scheduleAppointment(
//       patientId,
//       doctorId,
//       date,
//       timeSlot,
//       reason
//     );
//     res.json(appointment);
//   } catch (error) {
//     res.status(500).json({ message: "Error scheduling appointment.", error });
//   }
// };

// Get patient's upcoming appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract patient ID from logged-in user
    if (!userId) {
      return res.status(404).json({ message: "User not found." });
    }

    const patientId = await Patient.findOne({ user: userId }).select("_id");
    if (!patientId) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Find upcoming appointments for the patient
    const appointments = await Appointment.find({
      patient: patientId,
    })
      .populate("doctor", "name specialization") // Populate doctor details
      .sort({ date: 1 }); // Sort by nearest appointment first

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments.", error });
  }
};

// Get patient's prescriptions
export const getPatientPrescriptions = async (req, res) => {
  try {
    const patientId = await Patient.findOne({ user: req.user.userId }).select(
      "_id"
    );

    // Find prescriptions for the patient
    const prescriptions = await Prescription.find({
      patient: patientId,
    }).populate("doctor", "name specialization"); // Populate doctor details

    res.json({ success: true, prescriptions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescriptions.", error });
  }
};

// Get patient's notifications
export const getPatientNotifications = async (req, res) => {
  try {
    const notifications = await NotificationService.getPatientNotifications(
      req.user.userId
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications.", error });
  }
};

// Acknowledge a notification (e.g., marking it as read)
export const acknowledgeNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await NotificationService.acknowledgeNotification(
      notificationId
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }
    res.json({ message: "Notification marked as read." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error acknowledging notification.", error });
  }
};
