import React, { useState } from "react";
import "./Settings.css";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Profile from "../components/Interface/Settings/Profile";

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileDetails, setProfileDetails] = useState({});

  return (
    <div className="dashboard">
      {isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <Sidebar isOpen={isSidebarOpen} />
      <div className="interface">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <div className="settings-container">
          <Profile id={"6630d0f266c1df8754d20b97"} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
