import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import patientAPI from "../../api/patient";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import DashboardStatCard from "../../components/patient/DashboardStatCard";
import AppointmentCard from "../../components/patient/AppointmentCard";
import PrescriptionCard from "../../components/patient/PrescriptionCard";
import NotificationItem from "../../components/patient/NotificationItem";
import "./Dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    stats: {
      upcomingAppointments: 0,
      activePrescriptions: 0,
      unreadNotifications: 0,
      totalRecords: 0,
    },
    appointments: [],
    prescriptions: [],
    notifications: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all required data in parallel
      const [profileRes, appointmentsRes, prescriptionsRes, notificationsRes] =
        await Promise.all([
          patientAPI.getProfile(),
          patientAPI.getAppointments(),
          patientAPI.getPrescriptions(),
          patientAPI.getNotifications(),
        ]);

      // Get unread notifications
      const unreadNotifications = (notificationsRes.data || [])
        .filter((notif) => !notif.isRead)
        .slice(0, 3);

      setDashboardData({
        profile: profileRes.data,
        stats: {
          upcomingAppointments: (
            appointmentsRes.data.appointments || []
          ).filter(
            (apt) =>
              new Date(apt.appointmentDate) > new Date() &&
              apt.status !== "cancelled"
          ).length,
          activePrescriptions: (
            prescriptionsRes.data.prescriptions || []
          ).filter((pres) => pres.status === "active").length,
          unreadNotifications: unreadNotifications.length,
          totalRecords: profileRes.data?.medicalRecords?.length || 0,
        },
        appointments: (appointmentsRes.data.appointments || [])
          .filter(
            (apt) =>
              new Date(apt.appointmentDate) > new Date() &&
              apt.status !== "cancelled"
          )
          .sort(
            (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
          )
          .slice(0, 2),
        prescriptions: (prescriptionsRes.data.prescriptions || [])
          .filter((pres) => pres.status === "active")
          .slice(0, 2),
        notifications: unreadNotifications,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner center size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger">{error}</div>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const { profile, stats, appointments, prescriptions, notifications } =
    dashboardData;

  return (
    <div className="patient-dashboard">
      <div className="dashboard-welcome">
        <h1 className="page-title">
          Welcome, {profile?.user?.fullname || "Patient"}
        </h1>
        <p className="dashboard-date">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="dashboard-stats-container">
        <DashboardStatCard
          title="Appointments"
          value={stats.upcomingAppointments}
          icon="fa-calendar-check"
          label="Upcoming"
          color="primary"
          link="/patient/appointments"
        />
        <DashboardStatCard
          title="Prescriptions"
          value={stats.activePrescriptions}
          icon="fa-prescription-bottle"
          label="Active"
          color="success"
          link="/patient/prescriptions"
        />
        <DashboardStatCard
          title="Notifications"
          value={stats.unreadNotifications}
          icon="fa-bell"
          label="Unread"
          color="warning"
          link="/patient/notifications"
        />
        <DashboardStatCard
          title="Medical Records"
          value={stats.totalRecords}
          icon="fa-file-medical"
          label="Total"
          color="info"
          link="/patient/medical-records"
        />
      </div>

      <div className="dashboard-main-content">
        <div className="dashboard-column">
          <div className="dashboard-card appointments-card">
            <div className="card-header">
              <h2>Upcoming Appointments</h2>
              <Link to="/patient/appointments" className="view-all">
                View All
              </Link>
            </div>
            <div className="card-content">
              {appointments.length > 0 ? (
                <div className="appointments-list">
                  {appointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-list-message">
                  <i className="fas fa-calendar-times"></i>
                  <p>No upcoming appointments</p>
                  <Link
                    to="/patient/appointments"
                    className="btn btn-primary btn-sm"
                  >
                    Schedule Now
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-card prescriptions-card">
            <div className="card-header">
              <h2>Active Prescriptions</h2>
              <Link to="/patient/prescriptions" className="view-all">
                View All
              </Link>
            </div>
            <div className="card-content">
              {prescriptions.length > 0 ? (
                <div className="prescriptions-list">
                  {prescriptions.map((prescription) => (
                    <PrescriptionCard
                      key={prescription._id}
                      prescription={prescription}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-list-message">
                  <i className="fas fa-prescription-bottle-alt"></i>
                  <p>No active prescriptions</p>
                  <Link
                    to="/patient/prescriptions"
                    className="btn btn-primary btn-sm"
                  >
                    View History
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-column">
          <div className="dashboard-card notifications-card">
            <div className="card-header">
              <h2>Recent Notifications</h2>
              <Link to="/patient/notifications" className="view-all">
                View All
              </Link>
            </div>
            <div className="card-content">
              {notifications.length > 0 ? (
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-list-message">
                  <i className="fas fa-bell-slash"></i>
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-card profile-summary-card">
            <div className="card-header">
              <h2>Profile Overview</h2>
              <Link to="/patient/profile" className="view-all">
                Edit Profile
              </Link>
            </div>
            <div className="card-content">
              <div className="profile-summary">
                <div className="profile-avatar">
                  {profile?.user?.profilePicture ? (
                    <img src={profile.user.profilePicture} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
                <div className="profile-details">
                  <h3>{profile?.user?.fullname || "Patient"}</h3>
                  <ul className="profile-info-list">
                    <li>
                      <i className="fas fa-envelope"></i>
                      <span>{profile?.user?.email || "No email provided"}</span>
                    </li>
                    <li>
                      <i className="fas fa-phone"></i>
                      <span>
                        {profile?.user?.contact?.phone || "No phone provided"}
                      </span>
                    </li>
                    {profile?.bloodType && (
                      <li>
                        <i className="fas fa-tint"></i>
                        <span>Blood Type: {profile.bloodType}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card quick-actions-card">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="card-content">
              <div className="quick-actions-grid">
                <Link to="/patient/appointments" className="quick-action-item">
                  <i className="fas fa-calendar-plus"></i>
                  <span>Book Appointment</span>
                </Link>
                <Link to="/patient/prescriptions" className="quick-action-item">
                  <i className="fas fa-pills"></i>
                  <span>View Medications</span>
                </Link>
                <Link
                  to="/patient/medical-records"
                  className="quick-action-item"
                >
                  <i className="fas fa-file-medical-alt"></i>
                  <span>View Records</span>
                </Link>
                <Link to="/patient/profile" className="quick-action-item">
                  <i className="fas fa-user-edit"></i>
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
