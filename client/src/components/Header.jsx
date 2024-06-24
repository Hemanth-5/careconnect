import React, { useState } from "react";
import "./Header.css";
import profile from "../assets/profile-pic.png";
import HeaderProfilePopup from "./HeaderProfilePopup";

function Header({ setIsSidebarOpen }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const togglePopup = () => {
    setIsPopupOpen((prevState) => !prevState);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="header">
      <div className="header-left">
        <i className="bi bi-list" onClick={toggleSidebar}></i>
        <form>
          <input type="text" placeholder="Search..." />
        </form>
      </div>
      <div className="header-right">
        <i className="bi bi-chat-left-text"></i>
        <img src={profile} alt="profile" onClick={togglePopup} />
      </div>
      {/* {isPopupOpen && <HeaderProfilePopup />} */}
    </div>
  );
}

export default Header;
