import React, { useState } from "react";
import "./Records.css";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Records() {
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

export default Records;
