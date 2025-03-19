// src/routes/AdminRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAdmin } from "../utils/auth";

const AdminRoute = () => {
  return isAdmin() ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default AdminRoute;
