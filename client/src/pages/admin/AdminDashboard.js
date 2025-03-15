import React from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./AdminDashboard.css"; // Admin-specific styles

const AdminDashboard = () => {
  return (
    <div className="admin-theme">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main Content Wrapper */}
      <div className="dashboard-container">
        {/* Navbar */}
        <Navbar role="admin" />

        {/* Dashboard Content */}
        <main className="dashboard-content">
          <h1>Welcome, Admin</h1>
          <div className="admin-cards">
            <div className="card">
              <h3>Total Users</h3>
              <p>1,250</p>
            </div>
            <div className="card">
              <h3>Pending Approvals</h3>
              <p>34</p>
            </div>
            <div className="card">
              <h3>Doctors Registered</h3>
              <p>278</p>
            </div>
            <div className="card">
              <h3>Active Appointments</h3>
              <p>589</p>
            </div>
          </div>

          {/* Recent Activities */}
          <section className="recent-activity">
            <h2>Recent Activity</h2>
            <ul>
              <li>Dr. John Doe requested a new specialization approval</li>
              <li>Patient Alice Smith updated her profile details</li>
              <li>System maintenance scheduled for March 20, 2025</li>
              <li>New doctor application received from Dr. Robert</li>
            </ul>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
