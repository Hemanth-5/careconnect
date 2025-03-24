import React from "react";
import { Link } from "react-router-dom";
import "./DashboardStatCard.css";

const DashboardStatCard = ({ title, value, icon, label, color, link }) => {
  return (
    <Link to={link} className={`stat-card stat-card-${color}`}>
      <div className="stat-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-number">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </Link>
  );
};

export default DashboardStatCard;
