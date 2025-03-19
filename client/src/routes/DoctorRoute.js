

// src/routes/DoctorRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isDoctor } from '../utils/auth';

const DoctorRoute = () => {
  return isDoctor() ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default DoctorRoute;