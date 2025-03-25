import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import "./Unauthorized.css";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userType");

    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h1>Unauthorized Access</h1>
        <p>
          You don't have permission to access this page. Please contact your
          administrator if you believe this is a mistake.
        </p>
        <div className="unauthorized-actions">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="outline-primary" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
