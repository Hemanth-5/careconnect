import React, { useState } from "react";
import "./Sidebar.css";

function Sidebar({ isOpen }) {
  const navLinks = [
    {
      title: "Dashboard",
      icon: "bi bi-house-door",
      url: "/dashboard",
    },
    // {
    //   title: "Doctors",
    //   icon: "bi bi-person",
    //   url: "/doctors-panel",
    // },
    // {
    //   title: "Patients",
    //   icon: "bi bi-people",
    //   url: "/patients-panel",
    // },
    // {
    //   title: "Appointments",
    //   icon: "bi bi-calendar2",
    //   url: "/appointments",
    // },
    // {
    //   title: "Records",
    //   icon: "bi bi-file-earmark-medical",
    //   url: "/records",
    // },
    {
      title: "Settings",
      icon: "bi bi-gear",
      url: "/settings",
    },
  ];
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <img src="../../assets/careconnect-logo.svg" alt="" />
      </div>
      <ul className="navlinks">
        {navLinks.map((link, index) => (
          <li key={index}>
            <a href={link.url}>
              <i className={link.icon}></i>
              {link.title}
            </a>
          </li>
        ))}
        <li id="sidebar sign-out">
          <a href="/login">
            <i className="bi bi-box-arrow-right"></i>Sign out
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
