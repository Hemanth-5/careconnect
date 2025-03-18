import AppointmentService from "../services/appointment.service.js";
import PrescriptionService from "../services/prescription.service.js";
import PatientRecordService from "../services/patientRecord.service.js";
import MedicalReportService from "../services/medicalReport.service.js";
import NotificationService from "../services/notification.service.js";

import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";

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

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const newAppointment = await AppointmentService.createAppointment({
      patient,
      doctor: doctor._id,
      date,
      timeSlot,
      reason,
    });

    // Populate new details in doctor model
    doctor.appointments.push(newAppointment._id);
    if (!doctor.patientsUnderCare.includes(patient)) {
      doctor.patientsUnderCare.push(patient);
    }
    await doctor.save();

    // Handle consulted Doctors
    // Now, update the patient's consultedDoctors field
    const dbPatient = await Patient.findById(patient);
    if (!dbPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const consultedDoctorIndex = dbPatient.consultedDoctors.findIndex(
      (entry) => entry.doctor.toString() === doctor._id.toString()
    );

    if (consultedDoctorIndex !== -1) {
      // If the doctor already exists in the consultedDoctors array, add the new appointment
      dbPatient.consultedDoctors[consultedDoctorIndex].appointments.push(
        newAppointment._id
      );
    } else {
      // If the doctor doesn't exist, add a new entry for this doctor
      dbPatient.consultedDoctors.push({
        doctor: doctor._id,
        appointments: [newAppointment._id],
      });
    }

    await dbPatient.save();

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updatedData = req.body;

    // Get the existing appointment details
    const updatedAppointment = await AppointmentService.updateAppointment(
      appointmentId,
      updatedData
    );
    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if the status is either "cancelled" or "completed"
    if (
      updatedAppointment.status === "cancelled" ||
      updatedAppointment.status === "completed"
    ) {
      const doctor = await Doctor.findById(updatedAppointment.doctor);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      // Remove the appointment from the doctor's appointments
      doctor.appointments = doctor.appointments.filter(
        (appointment) => appointment.toString() !== appointmentId
      );
      doctor.exhaustedAppointments.push(updatedAppointment._id);

      // If the appointment was the only one for this patient, remove the patient from the doctor's patientsUnderCare
      const patient = await Patient.findById(updatedAppointment.patient);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // Check if the patient has any remaining appointments with this doctor
      const hasOtherAppointments = patient.consultedDoctors.some(
        (entry) =>
          entry.doctor.toString() === doctor._id.toString() &&
          entry.appointments.length > 1
      );

      if (!hasOtherAppointments) {
        // If no other appointments with this doctor, remove the patient from the doctor's patientsUnderCare
        doctor.patientsUnderCare = doctor.patientsUnderCare.filter(
          (patientId) => patientId.toString() !== patient._id.toString()
        );
      }

      await doctor.save();

      // Remove the appointment from the patient's consultedDoctors array
      patient.consultedDoctors = patient.consultedDoctors.map((entry) => {
        if (entry.doctor.toString() === doctor._id.toString()) {
          entry.appointments = entry.appointments.filter(
            (appointmentId) => appointmentId.toString() !== appointmentId
          );
        }
        return entry;
      });

      await patient.save();
    }

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId).populate(
      "doctor patient"
    );
    // console.log(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Step 1: Delete the appointment from the AppointmentService
    const deletedAppointment = await AppointmentService.deleteAppointment(
      appointmentId
    );
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Step 2: Get the appointment's doctor and patient details
    const doctor = await Doctor.findById(appointment.doctor);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const patient = await Patient.findById(appointment.patient);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Step 3: Remove the appointment from the doctor's appointments array
    doctor.appointments = doctor.appointments.filter(
      (app) => app.toString() !== appointmentId
    );

    // Step 4: If the deleted appointment was the only one for this patient, remove the patient from doctor's patientsUnderCare
    const isPatientLastAppointmentWithDoctor = !patient.consultedDoctors.some(
      (entry) =>
        entry.doctor.toString() === doctor._id.toString() &&
        entry.appointments.length > 1
    );

    if (isPatientLastAppointmentWithDoctor) {
      doctor.patientsUnderCare = doctor.patientsUnderCare.filter(
        (patientId) => patientId.toString() !== patient._id.toString()
      );
    }

    // Save doctor after modifications
    await doctor.save();

    // Step 5: Remove the appointment from the patient's consultedDoctors array
    patient.consultedDoctors = patient.consultedDoctors.map((entry) => {
      if (entry.doctor.toString() === doctor._id.toString()) {
        entry.appointments = entry.appointments.filter(
          (appId) => appId.toString() !== appointmentId
        );
      }
      return entry;
    });

    // Step 6: If the patient no longer has any appointments with the doctor, remove the doctor from consultedDoctors
    patient.consultedDoctors = patient.consultedDoctors.filter(
      (entry) => entry.appointments.length > 0
    );

    // Save patient after modifications
    await patient.save();

    // Step 7: Send success response
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
