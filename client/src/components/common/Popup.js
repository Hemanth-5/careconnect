import React, { useEffect } from "react";
import "./Popup.css";

const Popup = ({
  type = "info", // success, error, warning, info
  message,
  title,
  isVisible = false,
  autoClose = true,
  duration = 5000, // Auto close after 5 seconds by default
  onClose,
  position = "top-right", // top-right, top-left, bottom-right, bottom-left, center
}) => {
  // Handle auto-close functionality
  useEffect(() => {
    let timer;
    if (isVisible && autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, autoClose, duration, onClose]);

  // Get appropriate icon for each type
  const getIcon = () => {
    switch (type) {
      case "success":
        return "fas fa-check-circle";
      case "error":
        return "fas fa-exclamation-circle";
      case "warning":
        return "fas fa-exclamation-triangle";
      case "info":
      default:
        return "fas fa-info-circle";
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`popup-container popup-position-${position}`}>
      <div className={`popup popup-${type}`}>
        <div className="popup-icon">
          <i className={getIcon()}></i>
        </div>
        <div className="popup-content">
          {title && <h4 className="popup-title">{title}</h4>}
          <p className="popup-message">{message}</p>
        </div>
        <button className="popup-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default Popup;
