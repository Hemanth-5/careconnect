import AppointmentService from "../services/appointment.service.js";
import PrescriptionService from "../services/prescription.service.js";
import PatientRecordService from "../services/patientRecord.service.js";
import MedicalReportService from "../services/medicalReport.service.js";
import NotificationService from "../services/notification.service.js";

import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Specialization from "../models/specialization.model.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

// Get doctor profile
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.userId })
      .populate("user")
      .populate("specializations");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update doctor profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const updateData = req.body;

    // Find doctor by user ID
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // If user data is included, update the associated user document
    if (updateData.user) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update basic user fields
      if (updateData.user.fullname) user.fullname = updateData.user.fullname;
      if (updateData.user.email) user.email = updateData.user.email;
      if (updateData.user.gender) user.gender = updateData.user.gender;

      // Update user contact information
      if (updateData.user.contact) {
        user.contact = user.contact || {};
        if (updateData.user.contact.phone) {
          user.contact.phone = updateData.user.contact.phone;
        }
        if (updateData.user.contact.address) {
          user.contact.address = updateData.user.contact.address;
        }
      }

      await user.save();
    }

    // Update doctor-specific fields
    if (updateData.experience !== undefined) {
      doctor.experience = updateData.experience;
    }

    if (updateData.education) {
      doctor.education = updateData.education;
    }

    if (updateData.bio) {
      doctor.bio = updateData.bio;
    }

    if (updateData.consultationFee !== undefined) {
      doctor.consultationFee = updateData.consultationFee;
    }

    // Update license details
    if (updateData.license) {
      doctor.license = doctor.license || {};
      if (updateData.license.number) {
        doctor.license.number = updateData.license.number;
      }
      if (updateData.license.expirationDate) {
        doctor.license.expirationDate = updateData.license.expirationDate;
      }
    }

    // Update specializations if provided
    if (
      updateData.specializations &&
      Array.isArray(updateData.specializations)
    ) {
      doctor.specializations = updateData.specializations;
    }

    // Handle availability schedule update
    if (updateData.availability && Array.isArray(updateData.availability)) {
      doctor.availability = updateData.availability;
    }

    await doctor.save();

    res.status(200).json({
      message: "Doctor profile updated successfully",
      doctor,
    });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload profile image
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete previous profile picture if it exists
    if (user.profilePicture) {
      const oldImagePath = path.join(
        process.cwd(),
        "uploads",
        path.basename(user.profilePicture)
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Set new profile picture
    const imageUrl = `/uploads/${req.file.filename}`;
    user.profilePicture = imageUrl;
    await user.save();

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profilePicture: imageUrl,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all specializations
export const getSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find().sort({ name: 1 });
    res.status(200).json(specializations);
  } catch (error) {
    console.error("Error fetching specializations:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
    // console.log(req.body);

    const specializations = req.body;

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

    const specializations = req.body;
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
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointments = await AppointmentService.getDoctorAppointments(
      doctor._id
    );
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { patient, appointmentDate, reason } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if the appointment date is within the availability of doctors
    // Example of appointment date (2025-03-28T03:30:00.000Z)
    // const appointmentDateObj = new Date(appointmentDate);
    // const dayOfWeek = appointmentDateObj.getDay(); // 0 is Sunday, 1 is Monday, etc.
    // const hours = appointmentDateObj.getHours();
    // const minutes = appointmentDateObj.getMinutes();

    // Check if doctor has availability for this day and time
    // const isDoctorAvailable = doctor.availability.some((schedule) => {
    //   // Check if the day matches
    //   if (schedule.day !== dayOfWeek) return false;

    //   // Convert schedule times to minutes for easier comparison
    //   const startTime = schedule.startTime.split(":");
    //   const endTime = schedule.endTime.split(":");

    //   const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
    //   const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
    //   const appointmentMinutes = hours * 60 + minutes;

    //   // Check if time is within the available range
    //   return (
    //     appointmentMinutes >= startMinutes && appointmentMinutes <= endMinutes
    //   );
    // });

    // if (!isDoctorAvailable) {
    //   return res.status(400).json({
    //     message:
    //       "The requested appointment time is not within the doctor's availability schedule.",
    //   });
    // }

    const newAppointment = await AppointmentService.createAppointment({
      patient,
      doctor: doctor._id,
      appointmentDate,
      reason,
      status: "scheduled",
    });

    // Populate new details in doctor model
    doctor.appointments.push(newAppointment._id);
    // console.log(doctor.patientsUnderCare);

    // Make sure the patient is added to patientsUnderCare array if not already there
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

// Get prescriptions
export const getPrescriptions = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const prescriptions = await PrescriptionService.getDoctorPrescriptions(
      doctor._id
    );
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescriptions", error });
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
    // console.log(patient, records);

    // 1️⃣ Validate if patient exists
    const dbPatient = await Patient.findById(patient);
    if (!dbPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Get the doctor ID from the authenticated user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 2️⃣ Create a new patient record with the doctor ID
    const newPatientRecord = await PatientRecordService.createPatientRecord({
      patient,
      doctor: doctor._id,
      records,
    });

    // 3️⃣ Link to Patient Model
    dbPatient.patientRecords.push(newPatientRecord._id);
    await dbPatient.save();

    res.status(201).json({
      message: "Patient record created successfully",
      record: newPatientRecord,
    });
  } catch (error) {
    console.error("Error creating patient record:", error);
    res.status(500).json({
      message: "Error creating patient record",
      error: error.message,
    });
  }
};

export const updatePatientRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const updatedData = req.body;

    // console.log(updatedData);

    // Validate if the patient record exists
    const updatedPatientRecord = await PatientRecordService.updatePatientRecord(
      recordId,
      updatedData
    );

    // console.log(updatedPatientRecord);

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

    // Validate patient if specified
    if (data.associatedPatient) {
      const patientExists = await Patient.findById(data.associatedPatient);
      if (!patientExists) {
        return res.status(404).json({ message: "Patient not found" });
      }
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

    // Set initial status to "processing"
    data.status = "processing";
    data.issuedBy = doctorExists._id;
    data.issuedByDoctor = doctorExists._id;

    // Create new medical report
    const newMedicalReport = await MedicalReportService.createMedicalReport(
      data
    );

    if (!newMedicalReport) {
      return res.status(500).json({ message: "Error creating medical report" });
    }

    // Add report to doctor's issued reports
    doctorExists.issuedReports.push(newMedicalReport._id);
    await doctorExists.save();

    // Return report with processing status to client
    res.status(201).json(newMedicalReport);

    // Asynchronously generate the actual report content
    // This would typically be handled by a background job or queue
    setTimeout(async () => {
      try {
        // Simulate report generation
        const reportData = {
          status: Math.random() > 0.1 ? "completed" : "failed", // 10% chance of failure for testing
          dateIssued: new Date(),
          document:
            Math.random() > 0.1
              ? {
                  url: `https://example.com/reports/${newMedicalReport._id}.pdf`,
                  filename: `report-${newMedicalReport._id}.pdf`,
                  size: Math.floor(Math.random() * 5 * 1024 * 1024), // Random size up to 5MB
                }
              : null,
        };

        // Update the report with the generated data
        await MedicalReportService.updateMedicalReport(
          newMedicalReport._id,
          reportData
        );

        // In a real implementation, you would also send a notification to the user
        // NotificationService.createNotification({
        //   recipient: user._id,
        //   type: 'report_ready',
        //   title: 'Report Ready',
        //   message: `Your ${getReportTypeName(data.reportType)} report is now ready for download.`,
        //   url: `/doctor/reports?id=${newMedicalReport._id}`,
        // });
      } catch (error) {
        console.error("Error generating report content:", error);
        await MedicalReportService.updateMedicalReport(newMedicalReport._id, {
          status: "failed",
        });
      }
    }, 5000); // Simulate 5 seconds of processing time
  } catch (error) {
    console.error("Error creating medical report:", error);
    res.status(500).json({
      message: "Error creating medical report",
      error: error.message,
    });
  }
};

// Helper function to get friendly report type name
function getReportTypeName(type) {
  switch (type) {
    case "patient-summary":
      return "Patient Summary";
    case "appointments":
      return "Appointments Report";
    case "prescriptions":
      return "Prescriptions Report";
    case "medical-records":
      return "Medical Records Report";
    case "analytics":
      return "Patient Analytics";
    default:
      return "Medical Report";
  }
}

// Update a medical report
export const updateMedicalReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const updatedData = req.body;

    // Validate the report exists and belongs to this doctor
    const existingReport = await MedicalReportService.getReportById(reportId);
    if (!existingReport) {
      return res.status(404).json({ message: "Medical report not found" });
    }

    const user = await User.findById(req.user.userId);
    const doctor = await Doctor.findOne({ user: user._id });

    // Ensure doctor can only update their own reports
    if (
      !doctor ||
      existingReport.issuedByDoctor.toString() !== doctor._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this report" });
    }

    // Don't allow changing certain fields once processing has started
    if (
      existingReport.status === "processing" &&
      (updatedData.reportType || updatedData.associatedPatient)
    ) {
      return res.status(400).json({
        message:
          "Cannot modify report type or patient while report is processing",
      });
    }

    const updatedReport = await MedicalReportService.updateMedicalReport(
      reportId,
      updatedData
    );

    if (!updatedReport) {
      return res
        .status(404)
        .json({ message: "Medical report could not be updated" });
    }

    res.json(updatedReport);
  } catch (error) {
    console.error("Error updating medical report:", error);
    res.status(500).json({
      message: "Error updating medical report",
      error: error.message,
    });
  }
};

// Delete a medical report
export const deleteMedicalReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    // First verify the report exists
    const report = await MedicalReportService.getReportById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Medical report not found" });
    }

    // Check if the doctor is authorized to delete this report
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // console.log(report.issuedByDoctor, doctor._id);
    // Verify the report belongs to this doctor
    if (report.issuedByDoctor._id.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this report",
      });
    }

    // Delete the report using the service
    const deletedReport = await MedicalReportService.deleteMedicalReport(
      reportId
    );

    // Remove the report reference from the doctor's issuedReports array
    doctor.issuedReports = doctor.issuedReports.filter(
      (id) => id.toString() !== reportId
    );
    await doctor.save();

    res.status(200).json({
      message: "Medical report deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting medical report:", error);
    res.status(500).json({
      message: "Error deleting medical report",
      error: error.message,
    });
  }
};

// Get all reports for a doctor
export const getReports = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get reports using the medical report service
    const reports = await MedicalReportService.getDoctorReports(doctor._id);

    // Populate patient and doctor information for each report
    const populatedReports = await Promise.all(
      reports.map(async (report) => {
        let populatedReport = report.toObject();

        // Populate associated patient details if exists
        if (report.associatedPatient) {
          try {
            const patient = await Patient.findById(
              report.associatedPatient
            ).populate("user", ["fullname", "email", "profilePicture"]);

            if (patient) {
              populatedReport.associatedPatient = patient;
            }
          } catch (err) {
            console.error(
              `Error populating patient for report ${report._id}:`,
              err
            );
          }
        }

        // Populate doctor details
        if (report.issuedByDoctor) {
          try {
            const doctorRecord = await Doctor.findById(
              report.issuedByDoctor
            ).populate("user", ["fullname", "email", "profilePicture"]);

            if (doctorRecord) {
              populatedReport.issuedByDoctor = doctorRecord;
            }
          } catch (err) {
            console.error(
              `Error populating doctor for report ${report._id}:`,
              err
            );
          }
        }

        return populatedReport;
      })
    );

    res.status(200).json(populatedReports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      message: "Error fetching reports",
      error: error.message,
    });
  }
};

// Get a specific report by ID
export const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Get the report using the medical report service
    const report = await MedicalReportService.getReportById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res
      .status(500)
      .json({ message: "Error fetching report", error: error.message });
  }
};

// Controller to get my patients
export const getMyPatients = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const patients = await Patient.find({
      _id: { $in: doctor.patientsUnderCare },
    }).populate("user", ["username", "email", "_id", "profilePicture"]);
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
};

// Controller for managing notifications
export const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notifications = await NotificationService.getNotifications(
      req.user.userId
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

// Controller to get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({})
      .populate("user", [
        "fullname",
        "email",
        "_id",
        "profilePicture",
        "username",
      ])
      .sort({ "user.username": 1 }); // Sort alphabetically by name
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all patients", error });
  }
};

// Controller to get doctor dashboard statistics
export const getDoctorDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const doctor = await Doctor.findOne({ user: user._id }).populate(
      "specializations"
    );
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get appointments
    const allAppointments = await AppointmentService.getDoctorAppointments(
      doctor._id
    );

    // Get total patients count
    const totalPatients = doctor.patientsUnderCare.length;

    // Calculate pending and completed appointments
    const pendingAppointments = allAppointments.filter(
      (apt) =>
        apt.status === "pending" ||
        apt.status === "confirmed" ||
        apt.status === "scheduled"
    ).length;

    const completedAppointments = allAppointments.filter(
      (apt) => apt.status === "completed"
    ).length;

    // Get today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = allAppointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= today && aptDate < tomorrow;
    }).length;

    // Get 5 most recent appointments
    const recentAppointments = await AppointmentService.getDoctorAppointments(
      doctor._id,
      { limit: 5, sort: { appointmentDate: -1 } }
    );

    // Populate patient details for recent appointments
    const populatedAppointments = await Promise.all(
      recentAppointments.map(async (apt) => {
        const patient = await Patient.findById(apt.patient).populate("user", [
          "fullname",
          "email",
          "profilePicture",
          "username",
        ]);
        return {
          ...apt.toObject(),
          patient: patient,
        };
      })
    );

    // Get 5 most recent patients
    const recentPatientsList = await Patient.find({
      _id: { $in: doctor.patientsUnderCare },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", ["fullname", "email", "profilePicture", "username"]);

    // Return dashboard data
    res.status(200).json({
      stats: {
        totalPatients,
        totalAppointments: allAppointments.length,
        pendingAppointments,
        completedAppointments,
        todayAppointments,
      },
      recentAppointments: populatedAppointments,
      recentPatients: recentPatientsList,
      doctorInfo: {
        name: user.fullname,
        email: user.email,
        specializations: doctor.specializations,
      },
    });
  } catch (error) {
    console.error("Error getting doctor dashboard:", error);
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};
