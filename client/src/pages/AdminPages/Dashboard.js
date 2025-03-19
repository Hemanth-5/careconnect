import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adminAPI from "../../api/admin";
import "./Dashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    specializations: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all required data in parallel
        const [doctors, patients, specializations, users] = await Promise.all([
          adminAPI.getAllDoctors(),
          adminAPI.getAllPatients(),
          adminAPI.getSpecializations(),
          adminAPI.getAllUsers(),
        ]);

        setStats({
          doctors: doctors.data.length,
          patients: patients.data.length,
          specializations: specializations.data.length,
          users: users.data.length,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome to the CareConnect admin portal.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <div className="stat-details">
                <h3 className="stat-number">{stats.doctors}</h3>
                <p className="stat-label">Doctors</p>
              </div>
              <Link to="/admin/doctors" className="stat-action">
                View all <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-procedures"></i>
              </div>
              <div className="stat-details">
                <h3 className="stat-number">{stats.patients}</h3>
                <p className="stat-label">Patients</p>
              </div>
              <Link to="/admin/patients" className="stat-action">
                View all <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-stethoscope"></i>
              </div>
              <div className="stat-details">
                <h3 className="stat-number">{stats.specializations}</h3>
                <p className="stat-label">Specializations</p>
              </div>
              <Link to="/admin/specializations" className="stat-action">
                View all <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-details">
                <h3 className="stat-number">{stats.users}</h3>
                <p className="stat-label">Total Users</p>
              </div>
              <Link to="/admin/users" className="stat-action">
                View all <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>

          <div className="quick-actions">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
              <Link to="/admin/users" className="quick-action-card">
                <i className="fas fa-user-plus"></i>
                <span>Add New User</span>
              </Link>
              <Link to="/admin/specializations" className="quick-action-card">
                <i className="fas fa-plus-circle"></i>
                <span>Add Specialization</span>
              </Link>
              <Link to="/admin/doctors" className="quick-action-card">
                <i className="fas fa-user-md"></i>
                <span>Manage Doctors</span>
              </Link>
              <Link to="/admin/patients" className="quick-action-card">
                <i className="fas fa-procedures"></i>
                <span>Manage Patients</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
