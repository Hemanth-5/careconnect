import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DoctorLayout.css";
import { API } from "../constants/api"; // Import API constants instead of the userAPI

const DoctorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [doctorData, setDoctorData] = useState({
    username: "",
    name: "",
    profilePicture: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Profile picture state variables
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(API.USERS.ME, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.data) {
          setDoctorData({
            username: response.data.username || "Doctor",
            name: response.data.fullname || "", // Match the field name in the user model
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
            setDoctorData({
              username: tokenData.username || "Doctor",
              name: tokenData.fullname || "", // Match the field name in the user model
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
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userType");

    // Redirect to login
    navigate("/login");
  };

  // Profile picture handlers
  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleCloseModal = () => {
    setShowProfileModal(false);
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleUploadProfilePicture = async () => {
    if (!selectedImage) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", selectedImage);

      const token = localStorage.getItem("token");
      const response = await axios.put(
        API.USERS.UPDATE_PROFILE_PICTURE,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response && response.data && response.data.profilePicture) {
        setDoctorData((prev) => ({
          ...prev,
          profilePicture: response.data.profilePicture,
        }));

        alert("Profile picture updated successfully!");
      }

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
      className={`doctor-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <aside className="doctor-sidebar">
        <div className="sidebar-header">
          <h2 className="logo">
            <i className="fas fa-stethoscope"></i>
            <span className="sidebar-text">Doctor Portal</span>
          </h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i
              className={`fas ${
                sidebarCollapsed ? "fa-angle-right" : "fa-angle-left"
              }`}
            ></i>
          </button>
        </div>

        {/* User profile section */}
        <div className="doctor-profile-section">
          <div
            className="doctor-avatar"
            onClick={handleProfileClick}
            title="Click to change profile picture"
          >
            {doctorData.profilePicture ? (
              <img
                src={doctorData.profilePicture}
                alt={doctorData.username}
                className="doctor-avatar-img"
              />
            ) : (
              <i className="fas fa-user-circle"></i>
            )}
          </div>
          <div className="doctor-info">
            <h3 className="doctor-name sidebar-text">{doctorData.name}</h3>
            <p className="doctor-username sidebar-text">
              {doctorData.username}
            </p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={location.pathname === "/doctor" ? "active" : ""}>
              <Link to="/doctor">
                <i className="fas fa-home"></i>
                <span className="sidebar-text">Dashboard</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/doctor/profile" ? "active" : ""
              }
            >
              <Link to="/doctor/profile">
                <i className="fas fa-user-md"></i>
                <span className="sidebar-text">My Profile</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/doctor/appointments" ? "active" : ""
              }
            >
              <Link to="/doctor/appointments">
                <i className="fas fa-calendar-check"></i>
                <span className="sidebar-text">Appointments</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/doctor/patients" ? "active" : ""
              }
            >
              <Link to="/doctor/patients">
                <i className="fas fa-users"></i>
                <span className="sidebar-text">My Patients</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/doctor/prescriptions" ? "active" : ""
              }
            >
              <Link to="/doctor/prescriptions">
                <i className="fas fa-prescription"></i>
                <span className="sidebar-text">Prescriptions</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/doctor/medical-records" ? "active" : ""
              }
            >
              <Link to="/doctor/medical-records">
                <i className="fas fa-file-medical"></i>
                <span className="sidebar-text">Medical Records</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/doctor/reports" ? "active" : ""
              }
            >
              <Link to="/doctor/reports">
                <i className="fas fa-file-medical-alt"></i>
                <span className="sidebar-text">Medical Reports</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/doctor/notifications" ? "active" : ""
              }
            >
              <Link to="/doctor/notifications">
                <i className="fas fa-bell"></i>
                <span className="sidebar-text">Notifications</span>
              </Link>
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
      <main className="doctor-main-content">
        <Outlet />
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
                ) : doctorData.profilePicture ? (
                  <img
                    src={doctorData.profilePicture}
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

export default DoctorLayout;
