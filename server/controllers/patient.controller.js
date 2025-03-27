import NotificationService from "../services/notification.service.js";
import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import Prescription from "../models/prescription.model.js";
import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";
import PatientRecord from "../models/patientRecord.model.js";
import Specialization from "../models/specialization.model.js";

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

// Schedule an appointment
export const scheduleAppointment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { doctor, appointmentDate, reason } = req.body;

    if (!doctor || !appointmentDate) {
      return res
        .status(400)
        .json({ message: "Doctor and appointment date are required" });
    }

    // Get patient ID from user
    const patient = await Patient.findOne({ user: userId }).select("_id");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Validate doctor exists
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Create appointment
    const newAppointment = new Appointment({
      doctor,
      patient: patient._id,
      appointmentDate: new Date(appointmentDate),
      reason,
      status: "pending",
    });

    await newAppointment.save();

    // Add appointment to doctor's list
    doctorExists.appointments.push(newAppointment._id);

    // Add patient to doctor's patients under care if not already there
    if (!doctorExists.patientsUnderCare.includes(patient._id)) {
      doctorExists.patientsUnderCare.push(patient._id);
    }
    await doctorExists.save();

    // Update patient's consultedDoctors array
    const doctorIndex = patient.consultedDoctors?.findIndex(
      (entry) => entry.doctor.toString() === doctor
    );

    if (doctorIndex !== -1 && doctorIndex !== undefined) {
      // Doctor already in patient's consulted doctors
      patient.consultedDoctors[doctorIndex].appointments.push(
        newAppointment._id
      );
    } else {
      // Add doctor to patient's consulted doctors
      if (!patient.consultedDoctors) {
        patient.consultedDoctors = [];
      }
      patient.consultedDoctors.push({
        doctor,
        appointments: [newAppointment._id],
      });
    }
    await patient.save();

    // Create notification for doctor
    await NotificationService.createNotification({
      recipient: doctorExists.user,
      type: "appointment",
      message: `New appointment request from ${
        req.user.fullname || "a patient"
      } on ${new Date(appointmentDate).toLocaleDateString()}.`,
      relatedId: newAppointment._id,
    });

    res.status(201).json({
      success: true,
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error scheduling appointment:", error);
    res
      .status(500)
      .json({ message: "Error scheduling appointment.", error: error.message });
  }
};

// Update an appointment
export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.userId;
    const updatedData = req.body;

    // Get patient ID
    const patient = await Patient.findOne({ user: userId }).select("_id");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Verify patient owns the appointment
    if (appointment.patient.toString() !== patient._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this appointment." });
    }

    // Don't allow updating appointments that are completed or cancelled
    if (
      appointment.status === "completed" ||
      appointment.status === "cancelled"
    ) {
      return res.status(400).json({
        message: "Cannot update completed or cancelled appointments.",
      });
    }

    // Update appointment fields (only allow certain fields to be updated by patients)
    if (updatedData.reason) appointment.reason = updatedData.reason;
    if (updatedData.appointmentDate && appointment.status === "pending") {
      appointment.appointmentDate = new Date(updatedData.appointmentDate);
    }

    // Save the updated appointment
    const updated = await appointment.save();

    // Create notification for doctor
    await NotificationService.createNotification({
      recipient: appointment.doctor.user,
      type: "appointment",
      message: `Appointment details updated by patient for ${new Date(
        appointment.appointmentDate
      ).toLocaleDateString()}.`,
      relatedId: appointment._id,
    });

    res.json({ success: true, appointment: updated });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res
      .status(500)
      .json({ message: "Error updating appointment.", error: error.message });
  }
};

// Cancel an appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.userId;

    // Get patient ID
    const patient = await Patient.findOne({ user: userId }).select("_id");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Verify patient owns the appointment
    if (appointment.patient.toString() !== patient._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this appointment." });
    }

    // Don't allow cancelling already completed or cancelled appointments
    if (
      appointment.status === "completed" ||
      appointment.status === "cancelled"
    ) {
      return res
        .status(400)
        .json({ message: "Appointment already completed or cancelled." });
    }

    // Update appointment status
    appointment.status = "cancelled";
    appointment.statusHistory = appointment.statusHistory || [];
    appointment.statusHistory.push({
      status: "cancelled",
      changedBy: userId,
      timestamp: new Date(),
    });

    // Save the updated appointment
    await appointment.save();

    // Create notification for doctor
    // await NotificationService.createNotification({
    //   recipient: appointment.doctor.user,
    //   type: "appointment",
    //   message: `Appointment for ${new Date(
    //     appointment.appointmentDate
    //   ).toLocaleDateString()} has been cancelled by the patient.`,
    //   relatedId: appointment._id,
    // });

    res
      .status(200)
      .json({ success: true, message: "Appointment cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res
      .status(500)
      .json({ message: "Error cancelling appointment.", error: error.message });
  }
};

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
    // Populate all doctor details, along with expanded user details
    const appointments = await Appointment.find({
      patient: patientId._id,
    })
      .populate({
        path: "doctor",
        populate: [
          { path: "user", select: "fullname email profilePicture username" },
          { path: "specializations" },
        ],
      })
      .sort({ appointmentDate: 1 });

    res.status(200).json({ success: true, appointments });
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
    })
      .populate({
        path: "patient",
        populate: [
          {
            path: "user",
            select: "fullname email profilePicture username",
          },
        ],
      })
      .populate({
        path: "doctor",
        populate: [
          { path: "user", select: "fullname email profilePicture username" },
          { path: "specializations" },
        ],
      });

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

// Get patient's medical records
export const getPatientMedicalRecords = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get patient ID
    const patient = await Patient.findOne({ user: userId }).select("_id");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Get medical records for this patient
    const medicalRecords = await PatientRecord.find({ patient: patient._id })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "fullname email profilePicture",
        },
      })
      .sort({ createdAt: -1 });

    res.json(medicalRecords);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({
      message: "Error fetching medical records.",
      error: error.message,
    });
  }
};

// Get specific medical record
export const getPatientMedicalRecordById = async (req, res) => {
  try {
    const { recordId } = req.params;
    const userId = req.user.userId;

    // Get patient ID
    const patient = await Patient.findOne({ user: userId }).select("_id");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Find the medical record
    const record = await PatientRecord.findById(recordId).populate({
      path: "doctor",
      populate: {
        path: "user",
        select: "fullname email profilePicture",
      },
    });

    if (!record) {
      return res.status(404).json({ message: "Medical record not found." });
    }

    // Verify record belongs to patient
    if (record.patient.toString() !== patient._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this record." });
    }

    res.json(record);
  } catch (error) {
    console.error("Error fetching medical record:", error);
    res.status(500).json({
      message: "Error fetching medical record.",
      error: error.message,
    });
  }
};

// Get available doctors
export const getAvailableDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;

    let query = {};

    // Filter by specialization if provided
    if (specialization) {
      query.specializations = specialization;
    }

    const doctors = await Doctor.find(query)
      .populate({
        path: "user",
        select: "fullname email profilePicture",
      })
      .populate("specializations")
      .sort({ "user.fullname": 1 });

    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res
      .status(500)
      .json({ message: "Error fetching doctors.", error: error.message });
  }
};

// Get specific doctor details
export const getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId)
      .populate({
        path: "user",
        select: "fullname email profilePicture",
      })
      .populate("specializations");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res
      .status(500)
      .json({ message: "Error fetching doctor.", error: error.message });
  }
};

// Get specific prescription
export const getPrescriptionById = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const userId = req.user.userId;

    // Get patient ID
    const patient = await Patient.findOne({ user: userId }).select("_id");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Find the prescription
    const prescription = await Prescription.findById(prescriptionId)
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "fullname email profilePicture",
        },
      })
      .populate({
        path: "patient",
        populate: [
          {
            path: "user",
            select: "fullname email profilePicture",
          },
        ],
      });

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found." });
    }

    // Verify prescription belongs to patient
    if (prescription.patient.toString() !== patient._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this prescription." });
    }

    res.json({ success: true, prescription });
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res
      .status(500)
      .json({ message: "Error fetching prescription.", error: error.message });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await NotificationService.markAllNotificationsAsRead(userId);

    res.json({
      success: true,
      message: "All notifications marked as read.",
      count: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res
      .status(500)
      .json({ message: "Error updating notifications.", error: error.message });
  }
};
