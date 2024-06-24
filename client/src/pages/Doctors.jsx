import React, { useState } from "react";
import "./Doctors.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Doctors() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      {isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <Sidebar isOpen={isSidebarOpen} />
      <div className="interface">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <div className="doctors-list-plus-edit"></div>
      </div>
    </div>
  );
}

export default Doctors;
