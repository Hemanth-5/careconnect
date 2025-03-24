import React from "react";
import { Link } from "react-router-dom";
import "./PrescriptionCard.css";

const PrescriptionCard = ({ prescription }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="prescription-card-item">
      <div className="prescription-icon">
        <i className="fas fa-prescription-bottle-alt"></i>
      </div>

      <div className="prescription-details">
        <h4>
          {prescription.medications?.[0]?.name || "Medication"}
          {prescription.medications?.length > 1 &&
            ` + ${prescription.medications.length - 1} more`}
        </h4>

        <div className="prescription-info">
          <div className="prescription-doctor">
            <i className="fas fa-user-md"></i>
            Dr. {prescription.doctor?.user?.fullname || "Unknown"}
          </div>

          <div className="prescription-date">
            <i className="fas fa-calendar-alt"></i>
            {formatDate(prescription.startDate)}
          </div>
        </div>
      </div>

      <div className="prescription-status">
        <span className={`status-badge status-${prescription.status}`}>
          {prescription.status}
        </span>
        <Link to="/patient/prescriptions" className="view-details-link">
          Details
        </Link>
      </div>
    </div>
  );
};

export default PrescriptionCard;
