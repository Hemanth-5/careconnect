import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import "./PatientLayout.css";

const PatientLayout = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div
      className={`patient-layout ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <aside className="patient-sidebar">
        <div className="sidebar-header">
          <h2 className="logo">
            <i className="fas fa-hospital-user"></i>
            <span className="sidebar-text">Patient Portal</span>
          </h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i
              className={`fas ${
                sidebarCollapsed ? "fa-angle-right" : "fa-angle-left"
              }`}
            ></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={location.pathname === "/patient" ? "active" : ""}>
              <Link to="/patient">
                <i className="fas fa-home"></i>
                <span className="sidebar-text">Dashboard</span>
              </Link>
            </li>
            {/* Add more patient menu items here as they're developed */}
          </ul>
        </nav>
      </aside>

      <main className="patient-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;
