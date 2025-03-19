import React, { useState, useEffect, useRef } from "react";
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

  // New state variables for profile picture editing
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch user profile data using the API instead of parsing token
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getUserProfile();
        // console.log("response", response);
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

  // // Clean up preview URL when component unmounts or when a new file is selected
  // useEffect(() => {
  //   return () => {
  //     if (previewUrl) {
  //       URL.revokeObjectURL(previewUrl);
  //     }
  //   };
  // }, [previewUrl]);

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

  // Handle clicking on profile picture
  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Close modal and reset states
  const handleCloseModal = () => {
    setShowProfileModal(false);
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  // Upload profile picture
  const handleUploadProfilePicture = async () => {
    if (!selectedImage) return;

    try {
      setIsUploading(true);

      // Create form data for file upload
      const formData = new FormData();
      formData.append("image", selectedImage);

      // Call the API to update profile picture
      const response = await userAPI.updateProfilePicture(formData);

      // Update the UI with the new profile picture
      if (response && response.data && response.data.profilePicture) {
        setAdminData((prev) => ({
          ...prev,
          profilePicture: response.data.profilePicture,
        }));

        // Display success message
        alert("Profile picture updated successfully!");
      }

      // Close the modal
      handleCloseModal();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
              <span className="admin-user-name">{adminData.username}</span>
              <div
                className="admin-user-avatar"
                onClick={handleProfileClick}
                style={{ cursor: "pointer" }}
                title="Click to change profile picture"
              >
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
            </div>
          </div>
        </header>

        <div className="admin-content-body">
          <Outlet />
        </div>
      </main>

      {/* Profile Picture Modal */}
      {showProfileModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="profile-modal-header">
              <h3>Update Profile Picture</h3>
              <button className="close-button" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="profile-modal-body">
              <div className="profile-preview">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="preview-image"
                  />
                ) : adminData.profilePicture ? (
                  <img
                    src={adminData.profilePicture}
                    alt="Current"
                    className="preview-image"
                  />
                ) : (
                  <div className="no-image">
                    <i className="fas fa-user-circle"></i>
                    <p>No profile picture</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <div className="profile-modal-actions">
                <button
                  className="select-image-button"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                >
                  Select Image
                </button>
                <button
                  className="upload-button"
                  onClick={handleUploadProfilePicture}
                  disabled={!selectedImage || isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
