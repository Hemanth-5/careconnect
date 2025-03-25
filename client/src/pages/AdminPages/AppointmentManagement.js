import React, { useState, useEffect } from "react";
import adminAPI from "../../api/admin";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Popup from "../../components/common/Popup";
import "./AppointmentManagement.css";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    status: "",
    doctorId: "",
    patientId: "",
    startDate: "",
    endDate: "",
  });

  // Status update form
  const [statusForm, setStatusForm] = useState({
    status: "",
    notes: "",
  });

  // Add state for popup notifications
  const [popup, setPopup] = useState({
    show: false,
    type: "info",
    message: "",
    title: "",
  });

  // Show popup method
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

  useEffect(() => {
    fetchAppointments();
    fetchDoctorsAndPatients();
  }, []);

  const fetchDoctorsAndPatients = async () => {
    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        adminAPI.getAllDoctors(),
        adminAPI.getAllPatients(),
      ]);

      setDoctors(doctorsRes.data || []);
      setPatients(patientsRes.data || []);
    } catch (err) {
      console.error("Error fetching doctors and patients:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllAppointments(filters);
      setAppointments(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments. Please try again later.");
      showPopup(
        "error",
        "Failed to load appointments. Please try again later.",
        "Error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchAppointments();
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      doctorId: "",
      patientId: "",
      startDate: "",
      endDate: "",
    });
    // We'll fetch appointments after state update in useEffect
  };

  useEffect(() => {
    if (Object.values(filters).every((val) => val === "")) {
      fetchAppointments();
    }
  }, [filters]);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (appointment) => {
    setSelectedAppointment(appointment);
    setStatusForm({
      status: appointment.status,
      notes: "",
    });
    setShowStatusModal(true);
  };

  const handleStatusFormChange = (e) => {
    const { name, value } = e.target;
    setStatusForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitStatusUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await adminAPI.updateAppointmentStatus(
        selectedAppointment._id,
        statusForm
      );

      // Update local state
      setAppointments(
        appointments.map((apt) =>
          apt._id === selectedAppointment._id
            ? { ...apt, status: statusForm.status }
            : apt
        )
      );

      setShowStatusModal(false);
      setSelectedAppointment(null);
      showPopup(
        "success",
        "Appointment status updated successfully!",
        "Status Updated"
      );
    } catch (err) {
      console.error("Error updating appointment status:", err);
      showPopup(
        "error",
        "Failed to update appointment status. Please try again.",
        "Update Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  return (
    <div className="appointment-management">
      <div className="page-header">
        <h1 className="page-title">Appointment Management</h1>
        <Button
          variant="secondary"
          onClick={fetchAppointments}
          disabled={loading}
          className="refresh-button"
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filters section */}
      <div className="filters-panel">
        <h3>Filter Appointments</h3>
        <form onSubmit={applyFilters} className="filters-form">
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="doctorId">Doctor</label>
              <select
                id="doctorId"
                name="doctorId"
                value={filters.doctorId}
                onChange={handleFilterChange}
              >
                <option value="">All Doctors</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.user?.fullname ||
                      doctor.user?.username ||
                      "Unknown"}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="patientId">Patient</label>
              <select
                id="patientId"
                name="patientId"
                value={filters.patientId}
                onChange={handleFilterChange}
              >
                <option value="">All Patients</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.user?.fullname ||
                      patient.user?.username ||
                      "Unknown"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-actions">
              <Button
                type="submit"
                variant="outline-primary"
                disabled={loading}
              >
                Apply Filters
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={resetFilters}
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Appointments table */}
      {loading ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : (
        <div className="appointments-table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    {/* <td>{appointment._id.substring(0, 8)}...</td> */}
                    <td>
                      {appointment.patient?.user?.fullname ||
                        appointment.patient?.user?.username ||
                        "Unnamed"}
                    </td>
                    <td>
                      {appointment.doctor?.user?.fullname ||
                        appointment.doctor?.user?.username ||
                        "Unnamed"}
                    </td>
                    <td>{formatDate(appointment.appointmentDate)}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusBadgeClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status?.charAt(0).toUpperCase() +
                          appointment.status?.slice(1) || "Pending"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewDetails(appointment)}
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleUpdateStatus(appointment)}
                        title="Update Status"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Replace the custom modal with the common Modal component for appointment details */}
      {showDetailsModal && selectedAppointment && (
        <Modal
          title="Appointment Details"
          onClose={() => setShowDetailsModal(false)}
          size="large"
        >
          <div className="appointment-details-container">
            <div className="appointment-details">
              <div className="appointment-info">
                <h3>Appointment Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">ID:</span>
                    <span className="info-value">
                      {selectedAppointment._id}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Date & Time:</span>
                    <span className="info-value">
                      {formatDate(selectedAppointment.appointmentDate)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className="info-value">
                      <span
                        className={`status-badge ${getStatusBadgeClass(
                          selectedAppointment.status
                        )}`}
                      >
                        {selectedAppointment.status?.charAt(0).toUpperCase() +
                          selectedAppointment.status?.slice(1) || "Pending"}
                      </span>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Duration:</span>
                    <span className="info-value">
                      {selectedAppointment.duration || 30} minutes
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Created:</span>
                    <span className="info-value">
                      {formatDate(selectedAppointment.createdAt)}
                    </span>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div className="appointment-notes-container">
                    <h4>Notes</h4>
                    <p className="appointment-notes">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="detail-columns">
                <div className="patient-info">
                  <h3>Patient</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Name:</span>
                      <span className="info-value">
                        {selectedAppointment.patient?.user?.fullname || "N/A"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Username:</span>
                      <span className="info-value">
                        {selectedAppointment.patient?.user?.username || "N/A"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email:</span>
                      <span className="info-value">
                        {selectedAppointment.patient?.user?.email || "N/A"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone:</span>
                      <span className="info-value">
                        {selectedAppointment.patient?.user?.contact?.phone ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="doctor-info">
                  <h3>Doctor</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Name:</span>
                      <span className="info-value">
                        {selectedAppointment.doctor?.user?.fullname || "N/A"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Username:</span>
                      <span className="info-value">
                        {selectedAppointment.doctor?.user?.username || "N/A"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email:</span>
                      <span className="info-value">
                        {selectedAppointment.doctor?.user?.email || "N/A"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone:</span>
                      <span className="info-value">
                        {selectedAppointment.doctor?.user?.contact?.phone ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedAppointment.statusHistory &&
                selectedAppointment.statusHistory.length > 0 && (
                  <div className="status-history">
                    <h3>Status History</h3>
                    <div className="status-timeline">
                      {selectedAppointment.statusHistory.map(
                        (history, index) => (
                          <div key={index} className="status-item">
                            <div className="status-marker"></div>
                            <div className="status-content">
                              <div className="status-header">
                                <span
                                  className={`status-badge ${getStatusBadgeClass(
                                    history.status
                                  )}`}
                                >
                                  {history.status?.charAt(0).toUpperCase() +
                                    history.status?.slice(1) || "Unknown"}
                                </span>
                                <span className="status-date">
                                  {formatDate(history.timestamp)}
                                </span>
                              </div>
                              {history.notes && (
                                <p className="status-notes">{history.notes}</p>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div className="modal-actions">
              <Button
                variant="outline-primary"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleUpdateStatus(selectedAppointment);
                }}
              >
                Update Status
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Replace the custom modal with the common Modal component for status update */}
      {showStatusModal && selectedAppointment && (
        <Modal
          title="Update Appointment Status"
          onClose={() => setShowStatusModal(false)}
          size="medium"
        >
          <form onSubmit={submitStatusUpdate} className="status-update-form">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={statusForm.status}
                onChange={handleStatusFormChange}
                required
                className="status-select"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={statusForm.notes}
                onChange={handleStatusFormChange}
                rows="3"
                className="status-notes-input"
                placeholder="Add any relevant notes about this status change"
              ></textarea>
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline-primary"
                disabled={loading}
                loading={loading}
              >
                Update Status
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Popup component for notifications */}
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

export default AppointmentManagement;
