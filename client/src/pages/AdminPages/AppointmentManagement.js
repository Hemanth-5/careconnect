import React, { useState, useEffect } from "react";
import adminAPI from "../../api/admin";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
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
    } catch (err) {
      console.error("Error updating appointment status:", err);
      setError("Failed to update appointment status. Please try again.");
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
              <Button type="submit" variant="primary" disabled={loading}>
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
                <th>ID</th>
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
                    <td>{appointment._id.substring(0, 8)}...</td>
                    <td>
                      {appointment.patient?.user?.fullname ||
                        appointment.patient?.user?.username ||
                        "Unknown"}
                    </td>
                    <td>
                      {appointment.doctor?.user?.fullname ||
                        appointment.doctor?.user?.username ||
                        "Unknown"}
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

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal appointment-details-modal">
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="appointment-details">
                <div className="appointment-info">
                  <h3>Appointment Information</h3>
                  <p>
                    <strong>ID:</strong> {selectedAppointment._id}
                  </p>
                  <p>
                    <strong>Date & Time:</strong>{" "}
                    {formatDate(selectedAppointment.appointmentDate)}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        selectedAppointment.status
                      )}`}
                    >
                      {selectedAppointment.status?.charAt(0).toUpperCase() +
                        selectedAppointment.status?.slice(1) || "Pending"}
                    </span>
                  </p>
                  <p>
                    <strong>Duration:</strong>{" "}
                    {selectedAppointment.duration || 30} minutes
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {formatDate(selectedAppointment.createdAt)}
                  </p>
                  {selectedAppointment.notes && (
                    <div>
                      <strong>Notes:</strong>
                      <p className="appointment-notes">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="patient-info">
                  <h3>Patient</h3>
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedAppointment.patient?.user?.fullname || "N/A"}
                  </p>
                  <p>
                    <strong>Username:</strong>{" "}
                    {selectedAppointment.patient?.user?.username || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedAppointment.patient?.user?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedAppointment.patient?.user?.contact?.phone || "N/A"}
                  </p>
                </div>

                <div className="doctor-info">
                  <h3>Doctor</h3>
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedAppointment.doctor?.user?.fullname || "N/A"}
                  </p>
                  <p>
                    <strong>Username:</strong>{" "}
                    {selectedAppointment.doctor?.user?.username || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedAppointment.doctor?.user?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedAppointment.doctor?.user?.contact?.phone || "N/A"}
                  </p>
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
                                <p className="status-title">
                                  <span
                                    className={`status-badge ${getStatusBadgeClass(
                                      history.status
                                    )}`}
                                  >
                                    {history.status?.charAt(0).toUpperCase() +
                                      history.status?.slice(1) || "Unknown"}
                                  </span>
                                </p>
                                <p className="status-date">
                                  {formatDate(history.timestamp)}
                                </p>
                                {history.notes && (
                                  <p className="status-notes">
                                    {history.notes}
                                  </p>
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
                  variant="primary"
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
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal status-update-modal">
            <div className="modal-header">
              <h2>Update Appointment Status</h2>
              <button
                className="close-btn"
                onClick={() => setShowStatusModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={submitStatusUpdate}>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={statusForm.status}
                    onChange={handleStatusFormChange}
                    required
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
                    variant="primary"
                    disabled={loading}
                    loading={loading}
                  >
                    Update Status
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
