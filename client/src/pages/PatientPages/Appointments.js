import React, { useState, useEffect } from "react";
import patientAPI from "../../api/patient";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Popup from "../../components/common/Popup";
import "./Appointments.css";

const Appointments = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filter, setFilter] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  // Popup notification state
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    title: "",
    type: "info",
  });

  // Form state for booking appointments
  const [formData, setFormData] = useState({
    doctor: "",
    appointmentDate: "",
    timeSlot: "",
    reason: "",
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  // Show popup helper
  const showPopup = (type, message, title = "") => {
    setPopup({
      show: true,
      type,
      message,
      title,
    });
  };

  // Hide popup method
  const hidePopup = () => {
    setPopup((prev) => ({ ...prev, show: false }));
  };

  // Fetch patient's appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getAppointments();
      // console.log("Appointments", response.data);
      if (response && response.data) {
        setAppointments(response.data.appointments || []);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      showPopup("error", "Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch available doctors
  const fetchDoctors = async (specializationId = "") => {
    try {
      const response = await patientAPI.getAvailableDoctors(specializationId);
      if (response && response.data) {
        setDoctors(response.data || []);

        // Extract unique specializations from doctors
        const allSpecializations = [];
        response.data.forEach((doctor) => {
          if (doctor.specializations) {
            doctor.specializations.forEach((spec) => {
              if (!allSpecializations.some((s) => s._id === spec._id)) {
                allSpecializations.push(spec);
              }
            });
          }
        });
        setSpecializations(allSpecializations);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  // Filter doctors by specialization
  const handleSpecializationChange = (e) => {
    const specializationId = e.target.value;
    setSelectedSpecialization(specializationId);
    fetchDoctors(specializationId);
  };

  // Schedule a new appointment
  const handleScheduleAppointment = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Combine date and time
      const appointmentDateTime = new Date(
        `${formData.appointmentDate}T${formData.timeSlot}`
      );

      const appointmentData = {
        doctor: formData.doctor,
        appointmentDate: appointmentDateTime.toISOString(),
        reason: formData.reason,
      };

      const response = await patientAPI.scheduleAppointment(appointmentData);

      if (response && response.data) {
        showPopup("success", "Appointment scheduled successfully!");
        fetchAppointments();
        setShowBookingModal(false);
      }
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      showPopup(
        "error",
        err.response?.data?.message ||
          "Failed to schedule appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cancel an appointment
  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setLoading(true);
      await patientAPI.cancelAppointment(id);

      // Update the appointment status locally
      setAppointments(
        appointments.map((apt) =>
          apt._id === id ? { ...apt, status: "cancelled" } : apt
        )
      );

      showPopup("success", "Appointment cancelled successfully!");
      setShowDetailsModal(false);
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      showPopup(
        "error",
        err.response?.data?.message ||
          "Failed to cancel appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleOpenBookingModal = () => {
    // Reset form data
    setFormData({
      doctor: doctors.length > 0 ? doctors[0]._id : "",
      appointmentDate: getTomorrowDate(),
      timeSlot: "09:00",
      reason: "",
    });
    setShowBookingModal(true);
  };

  // Helper to get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get filtered appointments based on status
  const getFilteredAppointments = () => {
    const now = new Date();

    return appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);

        // Handle different filters
        if (filter === "upcoming") {
          return appointmentDate > now && appointment.status !== "cancelled";
        } else if (filter === "past") {
          return appointmentDate < now || appointment.status === "completed";
        } else if (filter === "cancelled") {
          return appointment.status === "cancelled";
        }

        return true;
      })
      .filter((appointment) => {
        if (!searchTerm) return true;

        const searchValue = searchTerm.toLowerCase();
        const doctorName =
          appointment.doctor?.user?.fullname?.toLowerCase() || "";
        const reason = appointment.reason?.toLowerCase() || "";

        return doctorName.includes(searchValue) || reason.includes(searchValue);
      });
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="patient-appointments-container">
      <div className="patient-appointments-header">
        <div className="patient-header-content">
          <h1 className="patient-page-title">My Appointments</h1>
          <p className="patient-subtitle">
            Manage and schedule your appointments with doctors
          </p>
        </div>
        <Button
          variant="outline-primary"
          onClick={handleOpenBookingModal}
          className="patient-book-btn"
        >
          <i className="fas fa-plus-circle"></i> Book New Appointment
        </Button>
      </div>

      <div className="patient-appointments-dashboard">
        <div className="patient-appointments-stats">
          <div className="patient-stat-card">
            <div className="patient-stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="patient-stat-info">
              <h3>
                {
                  appointments.filter(
                    (a) =>
                      new Date(a.appointmentDate) > new Date() &&
                      a.status !== "cancelled"
                  ).length
                }
              </h3>
              <p>Upcoming</p>
            </div>
          </div>
          <div className="patient-stat-card">
            <div className="patient-stat-icon">
              <i className="fas fa-history"></i>
            </div>
            <div className="patient-stat-info">
              <h3>
                {appointments.filter((a) => a.status === "completed").length}
              </h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="patient-stat-card">
            <div className="patient-stat-icon">
              <i className="fas fa-calendar-times"></i>
            </div>
            <div className="patient-stat-info">
              <h3>
                {appointments.filter((a) => a.status === "cancelled").length}
              </h3>
              <p>Cancelled</p>
            </div>
          </div>
        </div>

        <div className="patient-filter-bar">
          <div className="patient-search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by doctor or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="patient-filter-tabs">
            <button
              className={`patient-filter-tab ${
                filter === "upcoming" ? "active" : ""
              }`}
              onClick={() => setFilter("upcoming")}
            >
              <i className="fas fa-calendar-alt"></i> Upcoming
            </button>
            <button
              className={`patient-filter-tab ${
                filter === "past" ? "active" : ""
              }`}
              onClick={() => setFilter("past")}
            >
              <i className="fas fa-check-circle"></i> Past
            </button>
            <button
              className={`patient-filter-tab ${
                filter === "cancelled" ? "active" : ""
              }`}
              onClick={() => setFilter("cancelled")}
            >
              <i className="fas fa-ban"></i> Cancelled
            </button>
          </div>
        </div>

        {loading && !appointments.length ? (
          <div className="patient-loading-container">
            <Spinner center size="large" />
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="patient-appointments-list">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className={`patient-appointment-card status-${appointment.status}`}
              >
                <div className="patient-appointment-left">
                  <div className="patient-appointment-date">
                    <div className="patient-appointment-day">
                      {new Date(appointment.appointmentDate).getDate()}
                    </div>
                    <div className="patient-appointment-month">
                      {new Date(appointment.appointmentDate).toLocaleString(
                        "default",
                        { month: "short" }
                      )}
                    </div>
                    <div className="patient-appointment-year">
                      {new Date(appointment.appointmentDate).getFullYear()}
                    </div>
                    <div className="patient-appointment-time">
                      {formatTime(appointment.appointmentDate)}
                    </div>
                  </div>

                  {/* <div className="patient-doctor-avatar">
                    {appointment.doctor?.user?.profilePicture ? (
                      <img
                        src={appointment.doctor.user.profilePicture}
                        alt={appointment.doctor.user.fullname}
                      />
                    ) : (
                      <i className="fas fa-user-md"></i>
                    )}
                  </div> */}
                </div>

                <div className="patient-appointment-details">
                  <div className="patient-detail-header">
                    <h3 className="patient-doctor-name">
                      <i className="fas fa-user-md"></i> Dr.{" "}
                      {appointment.doctor?.user?.fullname || "Unknown"}
                    </h3>
                    <span
                      className={`patient-status-badge status-${appointment.status}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div className="patient-doctor-specialty">
                    {appointment.doctor?.specializations
                      ?.map((s) => s.name)
                      .join(", ") || "General Practitioner"}
                  </div>
                  <div className="patient-appointment-info">
                    {/* <div className="patient-detail">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>
                        {appointment.doctor?.clinicAddress || "Hospital Clinic"}
                      </span>
                    </div> */}
                    <div className="patient-detail">
                      <i className="fas fa-clipboard-list"></i>
                      <span>
                        {appointment.reason || "General consultation"}
                      </span>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="patient-appointment-notes">
                      <i className="fas fa-sticky-note"></i> {appointment.notes}
                    </div>
                  )}
                </div>

                <div className="patient-appointment-actions">
                  <button
                    className="patient-action-btn patient-view-btn"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    <i className="fas fa-eye"></i> View Details
                  </button>
                  {appointment.status !== "cancelled" &&
                    appointment.status !== "completed" &&
                    new Date(appointment.appointmentDate) > new Date() && (
                      <button
                        className="patient-action-btn patient-cancel-btn"
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        <i className="fas fa-times-circle"></i> Cancel
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="patient-empty-state">
            <div className="patient-empty-icon">
              <i className="fas fa-calendar-times"></i>
            </div>
            <h2>No {filter} appointments found</h2>
            <p>
              {filter === "upcoming"
                ? "You don't have any upcoming appointments scheduled. Book one now to get started!"
                : filter === "past"
                ? "You don't have any past appointments in our records."
                : "You don't have any cancelled appointments."}
            </p>
            {filter === "upcoming" && (
              <Button
                variant="outline-primary"
                onClick={handleOpenBookingModal}
              >
                <i className="fas fa-plus-circle"></i> Book Your First
                Appointment
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <Modal
          title="Appointment Details"
          onClose={() => setShowDetailsModal(false)}
          size="large"
        >
          <div className="patient-appointment-details-modal">
            <div className="patient-doctor-profile-section">
              <div className="patient-doctor-profile">
                <div className="patient-doctor-avatar-large">
                  {selectedAppointment.doctor?.user?.profilePicture ? (
                    <img
                      src={selectedAppointment.doctor.user.profilePicture}
                      alt={selectedAppointment.doctor.user.fullname}
                    />
                  ) : (
                    <i className="fas fa-user-md"></i>
                  )}
                </div>
                <div className="patient-doctor-info">
                  <h4>
                    Dr.{" "}
                    {selectedAppointment.doctor?.user?.fullname || "Unknown"}
                  </h4>
                  <div className="patient-doctor-specialty">
                    {selectedAppointment.doctor?.specializations
                      ?.map((s) => s.name)
                      .join(", ") || "General Practitioner"}
                  </div>
                  <div className="patient-doctor-details">
                    <p>
                      <i className="fas fa-envelope"></i>
                      {selectedAppointment.doctor?.user?.email ||
                        "No email provided"}
                    </p>
                    {/* <p>
                      <i className="fas fa-phone-alt"></i>
                      {selectedAppointment.doctor?.contactNumber ||
                        "Contact clinic for number"}
                    </p> */}
                  </div>
                </div>
                <div className="patient-appointment-status-large">
                  <div
                    className={`patient-status-badge status-${selectedAppointment.status}`}
                  >
                    {selectedAppointment.status}
                  </div>
                  {/* <div className="patient-appointment-id">
                    ID: {selectedAppointment._id}
                  </div> */}
                </div>
              </div>
            </div>

            <div className="patient-appointment-sections">
              <div className="patient-detail-section">
                <h3>
                  <i className="fas fa-info-circle"></i> Appointment Information
                </h3>
                <div className="patient-detail-grid">
                  <div className="patient-detail-row">
                    <span className="patient-detail-label">Date & Time:</span>
                    <span className="patient-detail-value">
                      <i className="far fa-calendar-alt"></i>{" "}
                      {formatDate(selectedAppointment.appointmentDate)} at{" "}
                      {formatTime(selectedAppointment.appointmentDate)}
                    </span>
                  </div>
                  <div className="patient-detail-row">
                    <span className="patient-detail-label">
                      Reason for Visit:
                    </span>
                    <span className="patient-detail-value">
                      <i className="fas fa-clipboard-list"></i>{" "}
                      {selectedAppointment.reason || "General consultation"}
                    </span>
                  </div>
                  <div className="patient-detail-row">
                    <span className="patient-detail-label">Created:</span>
                    <span className="patient-detail-value">
                      <i className="far fa-clock"></i>{" "}
                      {formatDate(selectedAppointment.createdAt)} at{" "}
                      {formatTime(selectedAppointment.createdAt)}
                    </span>
                  </div>
                  {selectedAppointment.updatedAt && (
                    <div className="patient-detail-row">
                      <span className="patient-detail-label">
                        Last Updated:
                      </span>
                      <span className="patient-detail-value">
                        <i className="fas fa-sync-alt"></i>{" "}
                        {formatDate(selectedAppointment.updatedAt)} at{" "}
                        {formatTime(selectedAppointment.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="patient-detail-section">
                  <h3>
                    <i className="fas fa-sticky-note"></i> Notes
                  </h3>
                  <div className="patient-notes-content">
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}

              {selectedAppointment.status === "completed" &&
                selectedAppointment.prescription && (
                  <div className="patient-detail-section">
                    <h3>
                      <i className="fas fa-prescription"></i> Prescription
                    </h3>
                    <div className="patient-prescription-info">
                      {selectedAppointment.prescription.medications.map(
                        (med, index) => (
                          <div key={index} className="patient-medication-item">
                            <div className="patient-medication-name">
                              {med.name} - {med.dosage}
                            </div>
                            <div className="patient-medication-instructions">
                              {med.instructions}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {selectedAppointment.status !== "cancelled" &&
                selectedAppointment.status !== "completed" &&
                new Date(selectedAppointment.appointmentDate) > new Date() && (
                  <div className="patient-modal-actions">
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowDetailsModal(false)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleCancelAppointment(selectedAppointment._id)
                      }
                    >
                      <i className="fas fa-times-circle"></i> Cancel Appointment
                    </Button>
                  </div>
                )}
            </div>
          </div>
        </Modal>
      )}

      {/* Book Appointment Modal */}
      {showBookingModal && (
        <Modal
          title="Book New Appointment"
          onClose={() => setShowBookingModal(false)}
          size="medium"
        >
          <form
            className="patient-booking-form"
            onSubmit={handleScheduleAppointment}
          >
            <div className="patient-form-section">
              <h3>
                <i className="fas fa-user-md"></i> Doctor Selection
              </h3>
              <div className="patient-form-group">
                <label htmlFor="specialization">
                  Select Specialization (Optional)
                </label>
                <div className="patient-select-wrapper">
                  <select
                    id="specialization"
                    name="specialization"
                    value={selectedSpecialization}
                    onChange={handleSpecializationChange}
                  >
                    <option value="">All Specializations</option>
                    {specializations.map((spec) => (
                      <option key={spec._id} value={spec._id}>
                        {spec.name}
                      </option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>

              <div className="patient-form-group">
                <label htmlFor="doctor">Select Doctor</label>
                <div className="patient-select-wrapper">
                  <select
                    id="doctor"
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose a doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.user?.fullname || "Unknown"} -{" "}
                        {doctor.specializations
                          ?.map((s) => s.name)
                          .join(", ") || "General"}
                      </option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
            </div>

            <div className="patient-form-section">
              <h3>
                <i className="fas fa-calendar-alt"></i> Appointment Details
              </h3>
              <div className="patient-form-row">
                <div className="patient-form-group">
                  <label htmlFor="appointmentDate">Date</label>
                  <div className="patient-input-icon-wrapper">
                    {/* <i className="far fa-calendar-alt"></i> */}
                    <input
                      type="date"
                      id="appointmentDate"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleInputChange}
                      min={getTomorrowDate()}
                      required
                    />
                  </div>
                </div>

                <div className="patient-form-group">
                  <label htmlFor="timeSlot">Time</label>
                  <div className="patient-input-icon-wrapper">
                    {/* <i className="far fa-clock"></i> */}
                    <input
                      type="time"
                      id="timeSlot"
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="patient-form-group">
                <label htmlFor="reason">Reason for Visit</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Please describe your symptoms or reason for the appointment"
                  rows="4"
                  required
                ></textarea>
              </div>
            </div>

            <div className="patient-form-note">
              <i className="fas fa-info-circle"></i>
              <p>
                Please arrive 15 minutes before your appointment time. If you
                need to cancel, please do so at least 24 hours in advance.
              </p>
            </div>

            <div className="patient-form-actions">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline-primary"
                loading={loading}
                disabled={loading}
              >
                <i className="fas fa-calendar-check"></i> Schedule Appointment
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Popup notifications */}
      <Popup
        type={popup.type}
        title={popup.title}
        message={popup.message}
        isVisible={popup.show}
        onClose={hidePopup}
        position="top-right"
        autoClose={true}
        duration={5000}
      />
    </div>
  );
};

export default Appointments;
