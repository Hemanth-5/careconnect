import React from "react";
import "./Navbar.css";

const Navbar = ({ role }) => {
  return (
    <nav className={`navbar ${role}-theme`}>
      <h1>CareConnect Admin</h1>
      <div className="nav-items">
        <i className="fas fa-bell"></i>
        <i className="fas fa-user-circle"></i>
      </div>
    </nav>
  );
};

export default Navbar;
