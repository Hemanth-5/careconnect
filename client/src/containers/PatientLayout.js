import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import "./PatientLayout.css";
import userAPI from "../api/user"; // Import userAPI instead of using axios directly
import Popup from "../components/common/Popup";

const PatientLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [patientData, setPatientData] = useState({
    username: "",
    name: "",
    profilePicture: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const [popup, setPopup] = useState({
    show: false,
    type: "info",
    message: "",
    title: "",
  });

  // Profile picture state variables
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const showPopup = (type, message, title = "") => {
    setPopup({
      show: true,
      type,
      message,
      title,
    });
  };

  // Hide popup method
  const hidePopup = () => {
    setPopup((prev) => ({ ...prev, show: false }));
  };

  useEffect(() => {
    // Fetch user profile data using userAPI
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getUserProfile();

        if (response && response.data) {
          setPatientData({
            username: response.data.username || "Patient",
            name: response.data.fullname || "",
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
            setPatientData({
              username: tokenData.username || "Patient",
              name: tokenData.fullname || "",
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

      // Create form data for file upload
      const formData = new FormData();
      formData.append("image", selectedImage);

      // Use userAPI to update profile picture
      const response = await userAPI.updateProfilePicture(formData);

      if (response && response.data && response.data.profilePicture) {
        setPatientData((prev) => ({
          ...prev,
          profilePicture: response.data.profilePicture,
        }));

        showPopup("success", "Profile picture updated successfully!");
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      showPopup("error", "Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`patient-layout ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* Sidebar */}
      <aside className="patient-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-logo">
            {sidebarCollapsed ? "CC" : "CareConnect"}
          </h1>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i
              className={`fas fa-${
                sidebarCollapsed ? "chevron-right" : "chevron-left"
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
            <li
              className={
                location.pathname === "/patient/profile" ? "active" : ""
              }
            >
              <Link to="/patient/profile">
                <i className="fas fa-user"></i>
                <span className="sidebar-text">My Profile</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/patient/appointments" ? "active" : ""
              }
            >
              <Link to="/patient/appointments">
                <i className="fas fa-calendar-check"></i>
                <span className="sidebar-text">Appointments</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/patient/prescriptions" ? "active" : ""
              }
            >
              <Link to="/patient/prescriptions">
                <i className="fas fa-prescription-bottle-alt"></i>
                <span className="sidebar-text">Prescriptions</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/patient/medical-records" ? "active" : ""
              }
            >
              <Link to="/patient/medical-records">
                <i className="fas fa-file-medical-alt"></i>
                <span className="sidebar-text">Medical Records</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/patient/messages" ? "active" : ""
              }
            >
              <Link to="/patient/messages">
                <i className="fas fa-comment-medical"></i>
                <span className="sidebar-text">Messages</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/patient/billing" ? "active" : ""
              }
            >
              <Link to="/patient/billing">
                <i className="fas fa-file-invoice-dollar"></i>
                <span className="sidebar-text">Billing</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/patient/notifications" ? "active" : ""
              }
            >
              <Link to="/patient/notifications">
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

      {/* Main content */}
      <main className="patient-main-content">
        {/* Add header like AdminLayout */}
        <header className="patient-header">
          <div className="patient-header-container">
            <h2 className="patient-title">Patient Portal</h2>
            <div className="patient-user-info">
              <span className="patient-user-name">
                {patientData.name || patientData.username}
              </span>
              <div
                className="patient-user-avatar"
                onClick={handleProfileClick}
                style={{ cursor: "pointer" }}
                title="Click to change profile picture"
              >
                {patientData.profilePicture ? (
                  <img
                    src={patientData.profilePicture}
                    alt={patientData.username}
                    className="patient-user-avatar-img"
                  />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="patient-content-body">
          <Outlet />
        </div>
      </main>

      {/* Profile Picture Modal - updated to match AdminLayout */}
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
                ) : patientData.profilePicture ? (
                  <img
                    src={patientData.profilePicture}
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
      {/* Add Popup component for notifications */}
      <Popup
        type={popup.type}
        title={popup.title}
        message={popup.message}
        isVisible={popup.show}
        onClose={hidePopup}
        position="top-right"
        autoClose={true}
        duration={5000}
      />
    </div>
  );
};

export default PatientLayout;
