import React from "react";
import { Link } from "react-router-dom";
import "./AppointmentCard.css";

const AppointmentCard = ({ appointment }) => {
  // Format date for display
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="appointment-card-item">
      <div className="appointment-date-badge">
        <div className="appointment-day">
          {new Date(appointment.appointmentDate).getDate()}
        </div>
        <div className="appointment-month">
          {new Date(appointment.appointmentDate).toLocaleString("default", {
            month: "short",
          })}
        </div>
      </div>

      <div className="appointment-details">
        <h4 className="doctor-name">
          Dr. {appointment.doctor?.user?.fullname || "Unknown"}
        </h4>
        <div className="appointment-info">
          <div className="appointment-time">
            <i className="far fa-clock"></i>
            {formatTime(appointment.appointmentDate)}
          </div>
          <div className="appointment-reason">
            <i className="fas fa-clipboard-list"></i>
            {appointment.reason || "General consultation"}
          </div>
        </div>
      </div>

      <div className="appointment-status">
        <span className={`status-badge status-${appointment.status}`}>
          {appointment.status}
        </span>
        <Link to="/patient/appointments" className="view-details-link">
          Details
        </Link>
      </div>
    </div>
  );
};

export default AppointmentCard;
