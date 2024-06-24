import React, { useState } from "react";
import "./Patients.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Patients() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      {isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <Sidebar isOpen={isSidebarOpen} />
      <div className="interface">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <div className=""></div>
      </div>
    </div>
  );
}

export default Patients;
