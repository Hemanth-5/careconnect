import AppointmentService from "../services/appointment.service.js";
import PrescriptionService from "../services/prescription.service.js";
import PatientRecordService from "../services/patientRecord.service.js";
import MedicalReportService from "../services/medicalReport.service.js";
import NotificationService from "../services/notification.service.js";

// Controller for managing appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentService.getAppointments(req.user._id);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { patient, date, timeSlot, reason } = req.body;
    const newAppointment = await AppointmentService.createAppointment(
      patient,
      req.user._id,
      date,
      timeSlot,
      reason
    );
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updatedData = req.body;
    const updatedAppointment = await AppointmentService.updateAppointment(
      appointmentId,
      updatedData
    );
    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const deletedAppointment = await AppointmentService.deleteAppointment(
      appointmentId
    );
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment", error });
  }
};

// Controller for managing prescriptions
export const createPrescription = async (req, res) => {
  try {
    const { patient, medications, startDate, endDate, notes } = req.body;
    const newPrescription = await PrescriptionService.createPrescription(
      patient,
      req.user._id,
      medications,
      startDate,
      endDate,
      notes
    );
    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(500).json({ message: "Error creating prescription", error });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const updatedData = req.body;
    const updatedPrescription = await PrescriptionService.updatePrescription(
      prescriptionId,
      updatedData
    );
    if (!updatedPrescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    res.json(updatedPrescription);
  } catch (error) {
    res.status(500).json({ message: "Error updating prescription", error });
  }
};

// Controller for managing patient records
export const createPatientRecord = async (req, res) => {
  try {
    const { patient, records } = req.body;
    const newPatientRecord = await PatientRecordService.createPatientRecord(
      patient,
      records
    );
    res.status(201).json(newPatientRecord);
  } catch (error) {
    res.status(500).json({ message: "Error creating patient record", error });
  }
};

export const updatePatientRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const updatedData = req.body;
    const updatedPatientRecord = await PatientRecordService.updatePatientRecord(
      recordId,
      updatedData
    );
    if (!updatedPatientRecord) {
      return res.status(404).json({ message: "Patient record not found" });
    }
    res.json(updatedPatientRecord);
  } catch (error) {
    res.status(500).json({ message: "Error updating patient record", error });
  }
};

// Controller for managing medical reports
export const createMedicalReport = async (req, res) => {
  try {
    const { reportType, document, comments } = req.body;
    const newMedicalReport = await MedicalReportService.createMedicalReport(
      reportType,
      document,
      comments
    );
    res.status(201).json(newMedicalReport);
  } catch (error) {
    res.status(500).json({ message: "Error creating medical report", error });
  }
};

// Controller for managing notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationService.getNotifications(
      req.user._id
    );
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const updatedNotification =
      await NotificationService.markNotificationAsRead(notificationId);
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(updatedNotification);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking notification as read", error });
  }
};
