import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./PatientLayout.css";

const PatientLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Pages with icons for patient sidebar
  const patientPages = [
    { name: "Dashboard", path: "/patient", icon: "fa-chart-line" },
    {
      name: "Appointments",
      path: "/patient/appointments",
      icon: "fa-calendar-alt",
    },
    {
      name: "Prescriptions",
      path: "/patient/prescriptions",
      icon: "fa-prescription-bottle-alt",
    },
    {
      name: "Medical Records",
      path: "/patient/medical-records",
      icon: "fa-file-medical-alt",
    },
    { name: "Messages", path: "/patient/messages", icon: "fa-comment-medical" },
    { name: "Profile", path: "/patient/profile", icon: "fa-user" },
    { name: "Notifications", path: "/patient/notifications", icon: "fa-bell" },
  ];

  return (
    <div
      className={`patient-layout ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <aside className="patient-sidebar">
        <div className="sidebar-header">
          <h2 className="logo">
            <i className="fas fa-heartbeat"></i>
            <span className="sidebar-text">CareConnect</span>
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
            {patientPages.map((page) => (
              <li key={page.path}>
                <NavLink
                  to={page.path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  end={page.path === "/patient"}
                >
                  <i className={`fas ${page.icon}`}></i>
                  <span className="sidebar-text">{page.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span className="sidebar-text">Logout</span>
          </button>
        </div>
      </aside>

      <main className="patient-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;
