import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import doctorAPI from "../../api/doctor";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    todayAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard data from API
      const dashboardResponse = await doctorAPI.getDashboardStats();

      console.log(dashboardResponse.data);

      if (dashboardResponse && dashboardResponse.data) {
        setStats(
          dashboardResponse.data.stats || {
            totalPatients: 0,
            totalAppointments: 0,
            pendingAppointments: 0,
            completedAppointments: 0,
            todayAppointments: 0,
          }
        );

        setRecentAppointments(dashboardResponse.data.recentAppointments || []);
        setRecentPatients(dashboardResponse.data.recentPatients || []);
      } else {
        // Fallback to separate API calls if dashboard endpoint not available
        await fetchSeparateData();
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");

      // Try separate approach as fallback
      await fetchSeparateData();
    } finally {
      setLoading(false);
    }
  };

  const fetchSeparateData = async () => {
    try {
      // Fetch appointments
      const appointmentsResponse = await doctorAPI.getAppointments();
      const appointments = appointmentsResponse.data || [];

      // Fetch patients
      const patientsResponse = await doctorAPI.getMyPatients();
      const patients = patientsResponse.data || [];

      // Calculate stats
      const pendingAppointments = appointments.filter(
        (apt) =>
          apt.status === "pending" ||
          apt.status === "confirmed" ||
          apt.status === "scheduled"
      ).length;

      const completedAppointments = appointments.filter(
        (apt) => apt.status === "completed"
      ).length;

      const today = new Date().toISOString().split("T")[0];
      const todayAppointments = appointments.filter(
        (apt) =>
          new Date(apt.appointmentDate).toISOString().split("T")[0] === today
      );

      // Get 5 most recent appointments
      const sortedAppointments = [...appointments]
        .sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        )
        .slice(0, 5);

      // Get 5 most recently added patients
      const sortedPatients = [...patients]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalPatients: patients.length,
        totalAppointments: appointments.length,
        pendingAppointments,
        completedAppointments,
        todayAppointments: todayAppointments.length,
      });

      setRecentAppointments(sortedAppointments);
      setRecentPatients(sortedPatients);
    } catch (err) {
      console.error("Error in fallback data fetch:", err);
      if (!error) {
        setError("Failed to load dashboard data. Please try again.");
      }
    }
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

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner center size="large" />
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      <h1 className="page-title">Dashboard</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="stats-grid">
        <div className="doctor stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalPatients}</h3>
            <p className="stat-label">Total Patients</p>
          </div>
        </div>

        <div className="doctor stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalAppointments}</h3>
            <p className="stat-label">Total Appointments</p>
          </div>
        </div>

        <div className="doctor stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.pendingAppointments}</h3>
            <p className="stat-label">Pending Appointments</p>
          </div>
        </div>

        <div className="doctor stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.completedAppointments}</h3>
            <p className="stat-label">Completed Appointments</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card appointments-today">
          <div className="card-header">
            <h2>Today's Schedule</h2>
          </div>
          <div className="card-body">
            {stats.todayAppointments > 0 ? (
              <div className="today-count">
                <h3>{stats.todayAppointments}</h3>
                <p>appointments scheduled for today</p>
                <Link
                  to="/doctor/appointments?filter=today"
                  className="view-all-link"
                >
                  <Button variant="outline-primary" size="sm">
                    View Today's Appointments
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="no-appointments">
                <i className="fas fa-calendar-times"></i>
                <p>No appointments scheduled for today</p>
                <Link to="/doctor/appointments" className="schedule-link">
                  <Button variant="outline-primary" size="sm">
                    Schedule New Appointment
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card recent-appointments">
          <div className="card-header">
            <h2>Recent Appointments</h2>
          </div>
          <div className="card-body">
            {recentAppointments.length > 0 ? (
              <div className="appointment-list">
                {recentAppointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-item">
                    <div className="appointment-details">
                      <h4>
                        {appointment.patient?.user?.fullname ||
                          appointment.patient?.user?.username ||
                          "Unknown Patient"}
                      </h4>
                      <p className="appointment-date">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                    </div>
                    <div className="appointment-status">
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
                ))}
                <div className="view-all">
                  <Link to="/doctor/appointments">
                    <Button variant="text">View All Appointments</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="no-data">
                <p>No recent appointments found</p>
                <Link to="/doctor/appointments">
                  <Button variant="outline-primary" size="sm">
                    Create New Appointment
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-card recent-patients">
        <div className="card-header">
          <h2>Recent Patients</h2>
        </div>
        <div className="card-body">
          {recentPatients.length > 0 ? (
            <div className="recent-patients-grid">
              {recentPatients.map((patient) => (
                <div key={patient._id} className="recent-patient-card">
                  <div className="patient-avatar">
                    {patient.user?.profilePicture ? (
                      <img
                        src={patient.user.profilePicture}
                        alt={patient.user?.fullname || "Patient"}
                      />
                    ) : (
                      <i className="fas fa-user"></i>
                    )}
                  </div>
                  <div className="patient-info">
                    <h4>
                      {patient.user?.fullname ||
                        patient.user?.username ||
                        "Unknown Patient"}
                    </h4>
                    <p>{patient.user?.email || "No email provided"}</p>
                    <Link to={`/doctor/patients?id=${patient._id}`}>
                      <Button variant="outline-primary" size="sm">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              <div className="view-all">
                <Link to="/doctor/patients">
                  <Button variant="text">View All Patients</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="no-data">No recent patients found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
