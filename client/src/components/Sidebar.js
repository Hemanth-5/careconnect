import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ role }) => {
  return (
    <aside className={`sidebar ${role}-theme`}>
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to="/admin/dashboard">
            <i className="fas fa-home"></i> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/users">
            <i className="fas fa-users"></i> Manage Users
          </Link>
        </li>
        <li>
          <Link to="/admin/doctors">
            <i className="fas fa-user-md"></i> Manage Doctors
          </Link>
        </li>
        <li>
          <Link to="/admin/appointments">
            <i className="fas fa-calendar-alt"></i> Appointments
          </Link>
        </li>
        <li>
          <Link to="/admin/reports">
            <i className="fas fa-chart-line"></i> Reports
          </Link>
        </li>
        <li>
          <Link to="/admin/settings">
            <i className="fas fa-cog"></i> Settings
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
