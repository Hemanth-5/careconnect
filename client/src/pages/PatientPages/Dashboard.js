import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="patient-dashboard">
      <h1 className="page-title">Patient Dashboard</h1>

      <div className="placeholder-message">
        <div className="placeholder-icon">
          <i className="fas fa-tools"></i>
        </div>
        <h2>Patient Portal Under Construction</h2>
        <p>
          The patient portal is currently being developed. Soon you'll be able
          to:
        </p>
        <ul>
          <li>Schedule appointments with your doctors</li>
          <li>View your medical records and prescriptions</li>
          <li>Communicate with your healthcare providers</li>
          <li>Manage your health information in one place</li>
        </ul>
        <p>Thank you for your patience!</p>
      </div>
    </div>
  );
};

export default Dashboard;
