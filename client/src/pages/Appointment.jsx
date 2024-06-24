import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./Appointment.css";
import Calendar from "../components/Calendar";

const Appointment = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      {isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <Sidebar isOpen={isSidebarOpen} />
      <div className="interface">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <div className="appointment">
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Appointment;
