import React, { useState, useEffect } from "react";
import doctorAPI from "../../api/doctor";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import "./Appointments.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [myPatients, setMyPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState("upcoming");

  // Form state for creating/editing appointments
  const [formData, setFormData] = useState({
    patient: "",
    date: "",
    timeSlot: "",
    reason: "",
    status: "scheduled",
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getAppointments();
      setAppointments(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      // Fetch patients under doctor's care
      const myPatientsResponse = await doctorAPI.getMyPatients();
      setMyPatients(myPatientsResponse.data || []);

      // Fetch all patients in the database
      const allPatientsResponse = await doctorAPI.getAllPatients();
      setAllPatients(allPatientsResponse.data || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patient data. Please try again.");
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleOpenNewAppointment = () => {
    setSelectedAppointment(null);
    setFormData({
      patient: "",
      date: getTomorrowDate(),
      timeSlot: "09:00",
      reason: "",
      status: "scheduled",
    });
    setShowAppointmentModal(true);
  };

  const handleOpenEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patient: appointment.patient?._id || "",
      date: new Date(appointment.appointmentDate).toISOString().split("T")[0],
      timeSlot: new Date(appointment.appointmentDate)
        .toTimeString()
        .slice(0, 5),
      reason: appointment.reason || "",
      status: appointment.status || "scheduled",
    });
    setShowAppointmentModal(true);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Combine date and time
      const appointmentDateTime = new Date(
        `${formData.date}T${formData.timeSlot}`
      );

      const appointmentData = {
        patient: formData.patient,
        appointmentDate: appointmentDateTime.toISOString(),
        reason: formData.reason,
        status: formData.status,
      };

      let response;

      if (selectedAppointment) {
        // Updating existing appointment
        response = await doctorAPI.updateAppointment(
          selectedAppointment._id,
          appointmentData
        );
        setSuccess("Appointment updated successfully!");
      } else {
        // Creating new appointment
        response = await doctorAPI.createAppointment(appointmentData);
        setSuccess("Appointment created successfully!");
      }

      // Refresh appointments
      fetchAppointments();

      // Close modal
      setShowAppointmentModal(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving appointment:", err);
      setError(
        selectedAppointment
          ? "Failed to update appointment. Please try again."
          : "Failed to create appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      setLoading(true);
      await doctorAPI.deleteAppointment(id);

      // Filter out the deleted appointment
      setAppointments(appointments.filter((apt) => apt._id !== id));

      setSuccess("Appointment deleted successfully!");
      setShowDetailsModal(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError("Failed to delete appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setLoading(true);

      await doctorAPI.updateAppointment(id, { status: newStatus });

      // Update the appointment in the local state
      setAppointments(
        appointments.map((apt) =>
          apt._id === id ? { ...apt, status: newStatus } : apt
        )
      );

      // If the details modal is open for this appointment, update it
      if (selectedAppointment && selectedAppointment._id === id) {
        setSelectedAppointment({ ...selectedAppointment, status: newStatus });
      }

      setSuccess(`Appointment status updated to ${newStatus}`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating appointment status:", err);
      setError("Failed to update appointment status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "status-scheduled";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      case "no-show":
        return "status-no-show";
      case "confirmed":
        return "status-confirmed";
      default:
        return "status-pending";
    }
  };

  // Filter appointments based on selected filter
  const filteredAppointments = appointments.filter((appointment) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointmentDate = new Date(appointment.appointmentDate);

    switch (filter) {
      case "today":
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        return appointmentDate >= today && appointmentDate <= todayEnd;

      case "upcoming":
        return (
          appointmentDate >= today &&
          appointment.status !== "completed" &&
          appointment.status !== "cancelled" &&
          appointment.status !== "no-show"
        );

      case "past":
        return (
          appointmentDate < today ||
          appointment.status === "completed" ||
          appointment.status === "cancelled" ||
          appointment.status === "no-show"
        );

      case "all":
      default:
        return true;
    }
  });

  return (
    <div className="doctor-appointments">
      <div className="appointments-header">
        <h1 className="page-title">Appointments</h1>
        <Button variant="primary" onClick={handleOpenNewAppointment}>
          <i className="fas fa-plus"></i> New Appointment
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === "upcoming" ? "active" : ""}`}
          onClick={() => handleFilterChange("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`filter-tab ${filter === "today" ? "active" : ""}`}
          onClick={() => handleFilterChange("today")}
        >
          Today
        </button>
        <button
          className={`filter-tab ${filter === "past" ? "active" : ""}`}
          onClick={() => handleFilterChange("past")}
        >
          Past
        </button>
        <button
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => handleFilterChange("all")}
        >
          All
        </button>
      </div>

      {loading && !appointments.length ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : (
        <div className="appointments-list">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card">
                <div className="appointment-time">
                  <div className="appointment-date">
                    {new Date(appointment.appointmentDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </div>
                  <div className="appointment-hour">
                    {new Date(appointment.appointmentDate).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>

                <div className="appointment-info">
                  <h3 className="patient-name">
                    {/* {console.log(appointment)} */}
                    {appointment.patient?.user?.fullname ||
                      appointment.patient?.user?.username ||
                      "Unknown Patient"}
                  </h3>

                  {appointment.reason && (
                    <p className="appointment-reason">{appointment.reason}</p>
                  )}

                  <div className="appointment-meta">
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status?.charAt(0).toUpperCase() +
                        appointment.status?.slice(1) || "Pending"}
                    </span>
                  </div>
                </div>

                <div className="appointment-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleViewDetails(appointment)}
                    title="View details"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleOpenEditAppointment(appointment)}
                    title="Edit appointment"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-appointments">
              <i className="fas fa-calendar-times"></i>
              <p>No {filter} appointments found.</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Appointment Modal */}
      {showAppointmentModal && (
        <Modal
          title={selectedAppointment ? "Edit Appointment" : "New Appointment"}
          onClose={() => setShowAppointmentModal(false)}
        >
          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-group">
              <label htmlFor="patient">Patient</label>
              <select
                id="patient"
                name="patient"
                value={formData.patient}
                onChange={handleInputChange}
                required
                disabled={selectedAppointment}
              >
                <option value="">Select a patient</option>

                {/* For new appointments, show all patients */}
                {!selectedAppointment && allPatients.length > 0 && (
                  <>
                    {/* If we have patients under care, group them first */}
                    {myPatients.length > 0 && (
                      <optgroup label="My Patients">
                        {myPatients.map((patient) => (
                          <option key={`my-${patient._id}`} value={patient._id}>
                            {patient.user?.username || "Unknown"}
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {/* Show other patients not under care */}
                    <optgroup label="Other Patients">
                      {allPatients
                        .filter(
                          (patient) =>
                            !myPatients.some(
                              (myPatient) => myPatient._id === patient._id
                            )
                        )
                        .map((patient) => (
                          <option
                            key={`other-${patient._id}`}
                            value={patient._id}
                          >
                            {patient.user?.username || "Unknown"}
                          </option>
                        ))}
                    </optgroup>
                  </>
                )}

                {/* For existing appointments, just show the current patient */}
                {selectedAppointment && (
                  <option value={formData.patient}>
                    {selectedAppointment.patient?.user?.username ||
                      "Unknown Patient"}
                  </option>
                )}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
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
              <label htmlFor="reason">Reason for visit</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Enter reason for appointment"
                rows="3"
              ></textarea>
            </div>

            {selectedAppointment && (
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>
            )}

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAppointmentModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
              >
                {selectedAppointment ? "Update" : "Create"} Appointment
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <Modal
          title="Appointment Details"
          onClose={() => setShowDetailsModal(false)}
        >
          <div className="appointment-details">
            <div className="detail-group">
              <h3>Date & Time</h3>
              <p className="detail-value">
                {formatDate(selectedAppointment.appointmentDate)}
              </p>
            </div>

            <div className="detail-group">
              <h3>Patient</h3>
              <p className="detail-value">
                {selectedAppointment.patient?.user?.username ||
                  "Unknown Patient"}
              </p>
              {selectedAppointment.patient?.user?.email && (
                <p className="detail-secondary">
                  Email: {selectedAppointment.patient.user.email}
                </p>
              )}
              {selectedAppointment.patient?.user?.contact?.phone && (
                <p className="detail-secondary">
                  Phone: {selectedAppointment.patient.user.contact.phone}
                </p>
              )}
            </div>

            <div className="detail-group">
              <h3>Status</h3>
              <p className="detail-value">
                <span
                  className={`status-badge ${getStatusBadgeClass(
                    selectedAppointment.status
                  )}`}
                >
                  {selectedAppointment.status?.charAt(0).toUpperCase() +
                    selectedAppointment.status?.slice(1) || "Pending"}
                </span>
              </p>
              <div className="status-actions">
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() =>
                    handleUpdateStatus(selectedAppointment._id, "completed")
                  }
                  disabled={
                    selectedAppointment.status === "completed" || loading
                  }
                >
                  Mark as Completed
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() =>
                    handleUpdateStatus(selectedAppointment._id, "no-show")
                  }
                  disabled={selectedAppointment.status === "no-show" || loading}
                >
                  Mark as No-Show
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() =>
                    handleUpdateStatus(selectedAppointment._id, "cancelled")
                  }
                  disabled={
                    selectedAppointment.status === "cancelled" || loading
                  }
                >
                  Cancel Appointment
                </Button>
              </div>
            </div>

            {selectedAppointment.reason && (
              <div className="detail-group">
                <h3>Reason for Visit</h3>
                <p className="detail-value">{selectedAppointment.reason}</p>
              </div>
            )}

            {selectedAppointment.notes && (
              <div className="detail-group">
                <h3>Notes</h3>
                <p className="detail-value notes">
                  {selectedAppointment.notes}
                </p>
              </div>
            )}

            <div className="detail-group">
              <h3>Appointment ID</h3>
              <p className="detail-value id">{selectedAppointment._id}</p>
            </div>

            <div className="modal-actions">
              <Button
                variant="primary"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleOpenEditAppointment(selectedAppointment);
                }}
              >
                Edit Appointment
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteAppointment(selectedAppointment._id)}
                disabled={loading}
              >
                Delete Appointment
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Appointments;
