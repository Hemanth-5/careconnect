// src/routes/index.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public components
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";

// Protected route components
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import DoctorRoute from "./DoctorRoute";
import PatientRoute from "./PatientRoute";

// Layout components
import AdminLayout from "../containers/AdminLayout";
import DoctorLayout from "../containers/DoctorLayout";
import PatientLayout from "../containers/PatientLayout";

// Admin pages
import AdminDashboard from "../pages/AdminPages/Dashboard";
import UserManagement from "../pages/AdminPages/UserManagement";
import SpecializationManagement from "../pages/AdminPages/SpecializationManagement";
import DoctorsList from "../pages/AdminPages/DoctorsList";
import PatientsList from "../pages/AdminPages/PatientsList";

// Doctor pages
import DoctorDashboard from "../pages/DoctorPages/Dashboard";
import DoctorProfile from "../pages/DoctorPages/Profile";
import DoctorAppointments from "../pages/DoctorPages/Appointments";
import DoctorPatients from "../pages/DoctorPages/Patients";
import DoctorPrescriptions from "../pages/DoctorPages/Prescriptions";
import DoctorMedicalReports from "../pages/DoctorPages/MedicalReports";
import DoctorNotifications from "../pages/DoctorPages/Notifications";

// Patient pages
import PatientDashboard from "../pages/PatientPages/Dashboard";
import PatientProfile from "../pages/PatientPages/Profile";
import PatientAppointments from "../pages/PatientPages/Appointments";
import PatientPrescriptions from "../pages/PatientPages/Prescriptions";
import PatientNotifications from "../pages/PatientPages/Notifications";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route
              path="/admin/specializations"
              element={<SpecializationManagement />}
            />
            <Route path="/admin/doctors" element={<DoctorsList />} />
            <Route path="/admin/patients" element={<PatientsList />} />
          </Route>
        </Route>

        {/* Doctor routes */}
        <Route element={<DoctorRoute />}>
          <Route element={<DoctorLayout />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            <Route
              path="/doctor/appointments"
              element={<DoctorAppointments />}
            />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route
              path="/doctor/prescriptions"
              element={<DoctorPrescriptions />}
            />
            <Route
              path="/doctor/medical-reports"
              element={<DoctorMedicalReports />}
            />
            <Route
              path="/doctor/notifications"
              element={<DoctorNotifications />}
            />
          </Route>
        </Route>

        {/* Patient routes */}
        <Route element={<PatientRoute />}>
          <Route element={<PatientLayout />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route
              path="/patient/appointments"
              element={<PatientAppointments />}
            />
            <Route
              path="/patient/prescriptions"
              element={<PatientPrescriptions />}
            />
            <Route
              path="/patient/notifications"
              element={<PatientNotifications />}
            />
          </Route>
        </Route>

        {/* Redirect based on user type */}
        <Route
          path="/dashboard"
          element={<Navigate to="/redirect" replace />}
        />
        <Route path="/redirect" element={<RedirectBasedOnRole />} />
      </Route>

      {/* Not found route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Helper component to redirect based on user role
const RedirectBasedOnRole = () => {
  const userType = localStorage.getItem("userType");

  switch (userType) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "doctor":
      return <Navigate to="/doctor/dashboard" replace />;
    case "patient":
      return <Navigate to="/patient/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default AppRoutes;
