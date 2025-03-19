// src/routes/PatientRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isPatient } from "../utils/auth";

const PatientRoute = () => {
  return isPatient() ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default PatientRoute;
