import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import patientAPI from "../../api/patient";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    todayAppointments: 0,
    activePrescriptions: 0,
    totalMedicalRecords: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [activePrescriptions, setActivePrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all required data in parallel
      const [profileRes, appointmentsRes, prescriptionsRes] = await Promise.all(
        [
          patientAPI.getProfile(),
          patientAPI.getAppointments(),
          patientAPI.getPrescriptions(),
        ]
      );

      // Process appointments data
      const appointments = appointmentsRes.data.appointments || [];
      const upcoming = appointments.filter(
        (apt) =>
          new Date(apt.appointmentDate) > new Date() &&
          apt.status !== "cancelled"
      );
      const completed = appointments.filter(
        (apt) => apt.status === "completed"
      );
      const today = new Date().toISOString().split("T")[0];
      const todayApts = appointments.filter(
        (apt) =>
          new Date(apt.appointmentDate).toISOString().split("T")[0] === today
      );

      // Process prescriptions data
      const prescriptions = prescriptionsRes.data.prescriptions || [];
      const active = prescriptions.filter((pres) => pres.status === "active");

      // Get medical records count
      const medicalRecords = profileRes.data?.medicalRecords || [];

      // Update stats
      setStats({
        totalAppointments: appointments.length,
        upcomingAppointments: upcoming.length,
        completedAppointments: completed.length,
        todayAppointments: todayApts.length,
        activePrescriptions: active.length,
        totalMedicalRecords: medicalRecords.length,
      });

      // Store profile data
      setProfile(profileRes.data);

      // Get 5 most recent upcoming appointments
      setUpcomingAppointments(
        upcoming
          .sort(
            (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
          )
          .slice(0, 5)
      );

      // Get active prescriptions
      setActivePrescriptions(active.slice(0, 5));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
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

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "--";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="patient-loading-container">
        <Spinner center size="large" />
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <h1 className="page-title">Dashboard</h1>

      {error && (
        <div className="patient-alert patient-alert-danger">{error}</div>
      )}

      <div className="patient-stats-grid">
        <div className="patient stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.upcomingAppointments}</h3>
            <p className="stat-label">Upcoming Appointments</p>
          </div>
        </div>

        <div className="patient stat-card">
          <div className="stat-icon">
            <i className="fas fa-prescription-bottle-alt"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.activePrescriptions}</h3>
            <p className="stat-label">Active Medications</p>
          </div>
        </div>

        <div className="patient stat-card">
          <div className="stat-icon">
            <i className="fas fa-file-medical-alt"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalMedicalRecords}</h3>
            <p className="stat-label">Medical Records</p>
          </div>
        </div>

        <div className="patient stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.completedAppointments}</h3>
            <p className="stat-label">Past Visits</p>
          </div>
        </div>
      </div>

      <div className="patient-dashboard-grid">
        <div className="patient-dashboard-card appointments-today">
          <div className="card-header">
            <h2>Today's Schedule</h2>
          </div>
          <div className="card-body">
            {stats.todayAppointments > 0 ? (
              <div className="today-count">
                <h3>{stats.todayAppointments}</h3>
                <p>appointments scheduled for today</p>
                <Link
                  to="/patient/appointments?filter=today"
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
                <Link to="/patient/appointments" className="schedule-link">
                  <Button variant="outline-primary" size="sm">
                    Schedule New Appointment
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="patient-dashboard-card upcoming-appointments">
          <div className="card-header">
            <h2>Upcoming Appointments</h2>
          </div>
          <div className="card-body">
            {upcomingAppointments.length > 0 ? (
              <div className="appointment-list">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-item">
                    <div className="appointment-details">
                      <h4>{appointment.doctor?.user?.fullname || "Doctor"}</h4>
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
                  <Link to="/patient/appointments">
                    <Button variant="text">View All Appointments</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="no-data">
                <p>No upcoming appointments found</p>
                <Link to="/patient/appointments">
                  <Button variant="outline-primary" size="sm">
                    Schedule New Appointment
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="patient-dashboard-row">
        <div className="patient-dashboard-card active-medications">
          <div className="card-header">
            <h2>Active Medications</h2>
          </div>
          <div className="card-body">
            {activePrescriptions.length > 0 ? (
              <div className="medication-list">
                {activePrescriptions.map((prescription) => (
                  <div key={prescription._id} className="medication-item">
                    <div className="medication-icon">
                      <i className="fas fa-prescription-bottle"></i>
                    </div>
                    <div className="medication-details">
                      <h4>
                        {prescription.medications?.[0]?.name || "Medication"}
                        {prescription.medications?.length > 1 &&
                          ` + ${prescription.medications.length - 1} more`}
                      </h4>
                      <p className="medication-dosage">
                        {prescription.medications?.[0]?.dosage || "As directed"}
                      </p>
                      <p className="medication-doctor">
                        <i className="fas fa-user-md"></i>
                        {prescription.doctor?.user?.fullname || "Doctor"}
                      </p>
                    </div>
                    <Link
                      to={`/patient/prescriptions/${prescription._id}`}
                      className="medication-link"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </Link>
                  </div>
                ))}
                <div className="view-all">
                  <Link to="/patient/prescriptions">
                    <Button variant="text">View All Medications</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="no-data">
                <p>No active medications found</p>
                <Link to="/patient/prescriptions">
                  <Button variant="outline-primary" size="sm">
                    View Medication History
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="patient-dashboard-card profile-overview">
          <div className="card-header">
            <h2>Profile Overview</h2>
          </div>
          <div className="card-body">
            <div className="profile-card">
              <div className="profile-avatar">
                {profile?.user?.profilePicture ? (
                  <img src={profile.user.profilePicture} alt="Profile" />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
              </div>
              <div className="profile-details">
                <h3>{profile?.user?.fullname || "Patient"}</h3>
                <div className="profile-stats">
                  {profile?.user?.dob && (
                    <div className="profile-stat">
                      <span className="stat-label">Age</span>
                      <span className="stat-value">
                        {calculateAge(profile.user.dob)}
                      </span>
                    </div>
                  )}
                  {profile?.bloodType && (
                    <div className="profile-stat">
                      <span className="stat-label">Blood Type</span>
                      <span className="stat-value">{profile.bloodType}</span>
                    </div>
                  )}
                  {profile?.height && (
                    <div className="profile-stat">
                      <span className="stat-label">Height</span>
                      <span className="stat-value">{profile.height} cm</span>
                    </div>
                  )}
                  {profile?.weight && (
                    <div className="profile-stat">
                      <span className="stat-label">Weight</span>
                      <span className="stat-value">{profile.weight} kg</span>
                    </div>
                  )}
                </div>
                <div className="profile-actions">
                  <Link to="/patient/profile">
                    <Button variant="outline-primary" size="sm">
                      Update Profile
                    </Button>
                  </Link>
                  <Link to="/patient/medical-records">
                    <Button variant="outline-secondary" size="sm">
                      View Records
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="patient-quick-access">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-access-grid">
          <Link to="/patient/appointments/new" className="quick-access-card">
            <div className="quick-access-icon">
              <i className="fas fa-calendar-plus"></i>
            </div>
            <h3>Book Appointment</h3>
          </Link>
          <Link to="/patient/messages" className="quick-access-card">
            <div className="quick-access-icon">
              <i className="fas fa-comment-medical"></i>
            </div>
            <h3>Message Doctor</h3>
          </Link>
          <Link to="/patient/medical-records" className="quick-access-card">
            <div className="quick-access-icon">
              <i className="fas fa-file-medical"></i>
            </div>
            <h3>Medical Records</h3>
          </Link>
          <Link to="/patient/billing" className="quick-access-card">
            <div className="quick-access-icon">
              <i className="fas fa-file-invoice-dollar"></i>
            </div>
            <h3>Billing</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
