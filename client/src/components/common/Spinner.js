import React from "react";
import "./Spinner.css";

const Spinner = ({ size = "medium", center = false }) => {
  const spinnerClasses = [
    "spinner",
    size === "small"
      ? "spinner-sm"
      : size === "large"
      ? "spinner-lg"
      : "spinner-md",
    center ? "spinner-center" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={spinnerClasses}>
      <div className="spinner-icon">
        <i className="fas fa-sync-alt"></i>
      </div>
      {/* <span className="spinner-text">Loading</span> */}
    </div>
  );
};

export default Spinner;
