import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

import userAPI from "../api/user";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    username: "",
    name: "",
    profilePicture: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile data using the API instead of parsing token
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getUserProfile();
        console.log("response", response);
        if (response && response.data) {
          setAdminData({
            username: response.data.username || "Admin",
            name: response.data.name || "",
            profilePicture: response.data.profilePicture || null,
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback to token data if API fails
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const tokenData = JSON.parse(atob(token.split(".")[1]));
            setAdminData({
              username: tokenData.username || "Admin",
              name: tokenData.name || "",
              profilePicture: tokenData.profilePicture || null,
            });
          } catch (e) {
            console.error("Error parsing token data:", e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userType");

    // Redirect to login
    navigate("/login");
  };

  return (
    <div
      className={`admin-layout ${
        isSidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-logo">
            {isSidebarCollapsed ? "CC" : "CareConnect"}
          </h1>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i
              className={`fas fa-${
                isSidebarCollapsed ? "chevron-right" : "chevron-left"
              }`}
            ></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fas fa-tachometer-alt"></i>
                <span className="sidebar-text">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fas fa-users"></i>
                <span className="sidebar-text">User Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/appointments"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fas fa-calendar-check"></i>
                <span className="sidebar-text">Appointments</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/specializations"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fas fa-stethoscope"></i>
                <span className="sidebar-text">Specializations</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/doctors"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fas fa-user-md"></i>
                <span className="sidebar-text">Doctors</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/patients"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fas fa-procedures"></i>
                <span className="sidebar-text">Patients</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/analytics"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fas fa-chart-line"></i>
                <span className="sidebar-text">Analytics</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span className="sidebar-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-content">
        <header className="admin-header">
          <div className="admin-header-container">
            <h2 className="admin-title">Admin Portal</h2>
            <div className="admin-user-info">
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <span className="admin-user-name">{adminData.username}</span>
                  <div className="admin-user-avatar">
                    {adminData.profilePicture ? (
                      <img
                        src={adminData.profilePicture}
                        alt={adminData.username}
                        className="admin-user-avatar-img"
                      />
                    ) : (
                      <i className="fas fa-user-circle"></i>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="admin-content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
