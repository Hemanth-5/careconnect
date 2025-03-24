import React, { useState, useEffect } from "react";
import patientAPI from "../../api/patient";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import "./Appointments.css";

const Appointments = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filter, setFilter] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

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

  // Fetch patient's appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getAppointments();
      if (response && response.data) {
        setAppointments(response.data.appointments || []);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments. Please try again.");
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
      setError(null);

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
        setSuccess("Appointment scheduled successfully!");
        fetchAppointments();
        setShowBookingModal(false);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      setError(
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

      setSuccess("Appointment cancelled successfully!");
      setShowDetailsModal(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      setError(
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
    <div className="patient-appointments">
      <div className="appointments-header">
        <h1 className="page-title">My Appointments</h1>
        <Button variant="primary" onClick={handleOpenBookingModal}>
          <i className="fas fa-plus"></i> Book Appointment
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="filter-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by doctor or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === "upcoming" ? "active" : ""}`}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`filter-tab ${filter === "past" ? "active" : ""}`}
            onClick={() => setFilter("past")}
          >
            Past
          </button>
          <button
            className={`filter-tab ${filter === "cancelled" ? "active" : ""}`}
            onClick={() => setFilter("cancelled")}
          >
            Cancelled
          </button>
        </div>
      </div>

      {loading && !appointments.length ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="appointments-list">
          {filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-date">
                <div className="appointment-day">
                  {new Date(appointment.appointmentDate).getDate()}
                </div>
                <div className="appointment-month">
                  {new Date(appointment.appointmentDate).toLocaleString(
                    "default",
                    { month: "short" }
                  )}
                </div>
                <div className="appointment-year">
                  {new Date(appointment.appointmentDate).getFullYear()}
                </div>
              </div>

              <div className="appointment-details">
                <h3 className="doctor-name">
                  Dr. {appointment.doctor?.user?.fullname || "Unknown"}
                </h3>
                <div className="detail">
                  <i className="fas fa-stethoscope"></i>
                  <span>
                    {appointment.doctor?.specializations
                      ?.map((s) => s.name)
                      .join(", ") || "General"}
                  </span>
                </div>
                <div className="detail">
                  <i className="far fa-clock"></i>
                  <span>{formatTime(appointment.appointmentDate)}</span>
                </div>
                <div className="detail">
                  <i className="fas fa-clipboard-list"></i>
                  <span>{appointment.reason || "General consultation"}</span>
                </div>
              </div>

              <div className="appointment-status">
                <span className={`status-badge status-${appointment.status}`}>
                  {appointment.status}
                </span>
                <div className="appointment-actions">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    View Details
                  </Button>
                  {/* Only show cancel button for upcoming appointments */}
                  {appointment.status !== "cancelled" &&
                    appointment.status !== "completed" &&
                    new Date(appointment.appointmentDate) > new Date() && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        Cancel
                      </Button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-calendar-times"></i>
          </div>
          <h2>No {filter} appointments found</h2>
          <p>
            {filter === "upcoming"
              ? "You don't have any upcoming appointments scheduled."
              : filter === "past"
              ? "You don't have any past appointments."
              : "You don't have any cancelled appointments."}
          </p>
          {filter === "upcoming" && (
            <Button variant="primary" onClick={handleOpenBookingModal}>
              Book Your First Appointment
            </Button>
          )}
        </div>
      )}

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <Modal
          title="Appointment Details"
          onClose={() => setShowDetailsModal(false)}
        >
          <div className="appointment-details-modal">
            <div className="detail-section">
              <h3>Appointment Information</h3>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span
                  className={`status-badge status-${selectedAppointment.status}`}
                >
                  {selectedAppointment.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">
                  {formatDate(selectedAppointment.appointmentDate)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time:</span>
                <span className="detail-value">
                  {formatTime(selectedAppointment.appointmentDate)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Reason:</span>
                <span className="detail-value">
                  {selectedAppointment.reason || "General consultation"}
                </span>
              </div>
              {selectedAppointment.notes && (
                <div className="detail-row">
                  <span className="detail-label">Notes:</span>
                  <span className="detail-value">
                    {selectedAppointment.notes}
                  </span>
                </div>
              )}
            </div>

            <div className="detail-section">
              <h3>Doctor Information</h3>
              <div className="doctor-profile">
                <div className="doctor-avatar">
                  {selectedAppointment.doctor?.user?.profilePicture ? (
                    <img
                      src={selectedAppointment.doctor.user.profilePicture}
                      alt={selectedAppointment.doctor.user.fullname}
                    />
                  ) : (
                    <i className="fas fa-user-md"></i>
                  )}
                </div>
                <div className="doctor-info">
                  <h4>
                    Dr.{" "}
                    {selectedAppointment.doctor?.user?.fullname || "Unknown"}
                  </h4>
                  <p>
                    <i className="fas fa-stethoscope"></i>
                    {selectedAppointment.doctor?.specializations
                      ?.map((s) => s.name)
                      .join(", ") || "General Practitioner"}
                  </p>
                  <p>
                    <i className="fas fa-envelope"></i>
                    {selectedAppointment.doctor?.user?.email ||
                      "No email provided"}
                  </p>
                </div>
              </div>
            </div>

            {selectedAppointment.status !== "cancelled" &&
              selectedAppointment.status !== "completed" &&
              new Date(selectedAppointment.appointmentDate) > new Date() && (
                <div className="modal-actions">
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleCancelAppointment(selectedAppointment._id)
                    }
                  >
                    Cancel Appointment
                  </Button>
                </div>
              )}
          </div>
        </Modal>
      )}

      {/* Book Appointment Modal */}
      {showBookingModal && (
        <Modal
          title="Book New Appointment"
          onClose={() => setShowBookingModal(false)}
        >
          <form className="booking-form" onSubmit={handleScheduleAppointment}>
            <div className="form-group">
              <label htmlFor="specialization">
                Select Specialization (Optional)
              </label>
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
            </div>

            <div className="form-group">
              <label htmlFor="doctor">Select Doctor</label>
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
                    {doctor.specializations?.map((s) => s.name).join(", ") ||
                      "General"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="appointmentDate">Date</label>
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

              <div className="form-group">
                <label htmlFor="timeSlot">Time</label>
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

            <div className="form-group">
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

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
              >
                Schedule Appointment
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Appointments;
