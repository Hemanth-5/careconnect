import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Hooks
import useAuth from "./hooks/useAuth";

// Login Pages
import Login from "./pages/Login";

// Admin Portal Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";

// Doctor Portal Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import ManageAppointments from "./pages/doctor/ManageAppointments";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorNotifications from "./pages/doctor/Notifications";
import PatientHistory from "./pages/doctor/PatientHistory";

// Patient Portal Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import BookAppointments from "./pages/patient/BookAppointments";
import PatientNotifications from "./pages/patient/Notifications";
import MedicalHistory from "./pages/patient/MedicalHistory";

const App = () => {
  const role = useAuth(); // Get the role (admin, doctor, or patient) after login

  // ProtectedRoute component to handle role-based access
  const ProtectedRoute = ({ roleRequired, children }) => {
    if (role === roleRequired) {
      return children;
    }
    return <Navigate to={`/login`} />;
  };

  return (
    <Router>
      <Routes>
        {/* Login Routes */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roleRequired="admin">
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminReports />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        {/* <Route path="/doctor/login" element={<DoctorLogin />} /> */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute roleRequired="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute roleRequired="doctor">
              <ManageAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute roleRequired="doctor">
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/notifications"
          element={
            <ProtectedRoute roleRequired="doctor">
              <DoctorNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patient-history"
          element={
            <ProtectedRoute roleRequired="doctor">
              <PatientHistory />
            </ProtectedRoute>
          }
        />

        {/* Patient Routes */}
        {/* <Route path="/patient/login" element={<PatientLogin />} /> */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute roleRequired="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute roleRequired="patient">
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute roleRequired="patient">
              <BookAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/notifications"
          element={
            <ProtectedRoute roleRequired="patient">
              <PatientNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/medical-history"
          element={
            <ProtectedRoute roleRequired="patient">
              <MedicalHistory />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            <>
              <h1>Welcome to the Health Portal</h1>
              <p>Please log in to continue.</p>

              <p>
                <a href="/admin/login">Admin Login</a>
              </p>
              <p>
                <a href="/doctor/login">Doctor Login</a>
              </p>
              <p>
                <a href="/patient/login">Patient Login</a>
              </p>
            </>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
