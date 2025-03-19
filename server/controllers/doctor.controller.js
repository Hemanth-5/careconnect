import AppointmentService from "../services/appointment.service.js";
import PrescriptionService from "../services/prescription.service.js";
import PatientRecordService from "../services/patientRecord.service.js";
import MedicalReportService from "../services/medicalReport.service.js";
import NotificationService from "../services/notification.service.js";

import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Specialization from "../models/specialization.model.js";

// Get doctor profile
export const getDoctorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor profile", error });
  }
};

// Update doctor profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const updatedData = req.body;
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { user: user._id },
      updatedData,
      { new: true }
    );
    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res
      .status(200)
      .json({ message: "Doctor profile updated successfully", updatedDoctor });
  } catch (error) {
    res.status(500).json({ message: "Error updating doctor profile", error });
  }
};

// Assign specializations to a doctor
export const assignSpecializations = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { specializations } = req.body;
    for (const specializationId of specializations) {
      const specialization = await Specialization.findById(specializationId);
      if (!specialization) {
        return res.status(404).json({ message: "Specialization not found" });
      }
      if (!doctor.specializations.includes(specializationId)) {
        doctor.specializations.push(specializationId);
      }
      if (!specialization.doctors.includes(doctor._id)) {
        specialization.doctors.push(doctor._id);
      }

      await specialization.save();
    }

    await doctor.save();
    res.status(200).json({ message: "Specializations assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error assigning specializations", error });
  }
};

// Remove specializations from a doctor
export const removeSpecializations = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { specializations } = req.body;
    for (const specializationId of specializations) {
      const specialization = await Specialization.findById(specializationId);
      if (!specialization) {
        return res.status(404).json({ message: "Specialization not found" });
      }
      doctor.specializations = doctor.specializations.filter(
        (id) => id.toString() !== specializationId
      );
      specialization.doctors = specialization.doctors.filter(
        (id) => id.toString() !== doctor._id.toString()
      );

      await specialization.save();
    }

    await doctor.save();
    res.status(200).json({ message: "Specializations removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing specializations", error });
  }
};

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
    const appointment = await AppointmentService.getAppointmentById(
      appointmentId
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
    // console.log(req.body);

    // Validate the patient exists
    const dbPatient = await Patient.findById(patient);
    if (!dbPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const dbUser = await User.findById(req.user.userId);
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const dbDoctor = await Doctor.findOne({ user: dbUser._id });
    if (!dbDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Create a new prescription
    const newPrescription = await PrescriptionService.createPrescription({
      patient,
      doctor: dbDoctor._id,
      medications,
      startDate,
      endDate,
      notes,
    });
    // console.log(newPrescription);

    // Optionally, add the prescription to the patient's record
    dbPatient.prescriptions.push(newPrescription._id);
    await dbPatient.save();

    // Optionally, add the prescription to the doctor's record
    dbDoctor.prescriptions.push(newPrescription._id);
    await dbDoctor.save();

    // Return the new prescription with populated patient and doctor details
    // const populatedPrescription = await Prescription.findById(newPrescription._id)
    //   .populate('patient')
    //   .populate('doctor');

    res.status(201).json({ message: "Prescription created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating prescription", error });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const updatedData = req.body;

    // Validate the prescription exists
    const dbPrescription = await PrescriptionService.getPrescription(
      prescriptionId
    );
    if (!dbPrescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Validate the patient exists
    const dbPatient = await Patient.findById(dbPrescription.patient);
    if (!dbPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Optionally, update the patient's prescriptions list (remove old prescription if needed)
    if (!dbPatient.prescriptions.includes(prescriptionId)) {
      dbPatient.prescriptions.push(prescriptionId);
    }
    await dbPatient.save();

    // Update the prescription details
    const updatedPrescription = await PrescriptionService.updatePrescription(
      prescriptionId,
      updatedData
    );
    if (!updatedPrescription) {
      return res.status(404).json({ message: "Error updating prescription" });
    }

    const doctor = await Doctor.findById(dbPrescription.doctor);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Update the doctor’s record with the new prescription
    if (!doctor.prescriptions.includes(prescriptionId)) {
      doctor.prescriptions.push(prescriptionId);
    }
    await doctor.save();

    // Return the updated prescription
    res.status(200).json({
      message: "Prescription updated successfully",
      updatedPrescription,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating prescription", error });
  }
};

// Controller for managing patient records
export const createPatientRecord = async (req, res) => {
  try {
    const { patient, records } = req.body;

    // 1️⃣ Validate if patient exists
    const dbPatient = await Patient.findById(patient);
    if (!dbPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // 2️⃣ Create a new patient record
    const newPatientRecord = await PatientRecordService.createPatientRecord({
      patient,
      records,
    });

    // 3️⃣ Link to Patient Model
    dbPatient.patientRecords.push(newPatientRecord._id);
    await dbPatient.save();

    res.status(201).json({ message: "Patient record created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating patient record", error });
  }
};

export const updatePatientRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const updatedData = req.body;

    // Validate if the patient record exists
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
    const data = req.body;

    // Validate patient
    const patientExists = await Patient.findById(data.associatedPatient);
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Validate doctor
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const doctorExists = await Doctor.findOne({ user: user._id });
    if (!doctorExists) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Create new medical report
    const newMedicalReport = await MedicalReportService.createMedicalReport(
      data
    );
    // console.log(newMedicalReport);

    if (!newMedicalReport) {
      return res.status(404).json({ message: "Error creating medical report" });
    }

    doctorExists.issuedReports.push(newMedicalReport._id);
    await doctorExists.save();

    res.status(201).json({ message: "Medical report created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating medical report", error });
  }
};

// Update a medical report
export const updateMedicalReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const updatedData = req.body;

    const updatedReport = await MedicalReportService.updateMedicalReport(
      reportId,
      updatedData
    );
    if (!updatedReport) {
      return res.status(404).json({ message: "Medical report not found" });
    }

    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: "Error updating medical report", error });
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
