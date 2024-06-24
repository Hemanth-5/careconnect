import React from "react";
import "./HeaderProfilePopup.css";

const HeaderProfilePopup = ({ closePopup }) => {
  return (
    <div className="header-profile-popup" onClick={closePopup}>
      <div className="header-profile-popup-item">
        <i className="bi bi-person"></i>
        <h2>Profile</h2>
      </div>
      <div className="header-profile-popup-item">
        <i className="bi bi-gear"></i>
        <h2>Settings</h2>
      </div>
      <div className="header-profile-popup-item">
        <i className="bi bi-box-arrow-right"></i>
        <h2>Logout</h2>
      </div>
    </div>
  );
};

export default HeaderProfilePopup;
