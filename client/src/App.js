import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Spinner from "./components/common/Spinner";

// Import Admin Pages
import AdminLayout from "./containers/AdminLayout";
import AdminDashboard from "./pages/AdminPages/Dashboard";
import UserManagement from "./pages/AdminPages/UserManagement";
import SpecializationManagement from "./pages/AdminPages/SpecializationManagement";
import DoctorsList from "./pages/AdminPages/DoctorsList";
import PatientsList from "./pages/AdminPages/PatientsList";
import AppointmentManagement from "./pages/AdminPages/AppointmentManagement";
import AnalyticsDashboard from "./pages/AdminPages/AnalyticsDashboard";

// Import Doctor Pages - Now with correct paths
import DoctorLayout from "./containers/DoctorLayout";
import DoctorDashboard from "./pages/DoctorPages/Dashboard";
import DoctorProfile from "./pages/DoctorPages/Profile";
import DoctorAppointments from "./pages/DoctorPages/Appointments";
import DoctorPatients from "./pages/DoctorPages/Patients";
import DoctorPrescriptions from "./pages/DoctorPages/Prescriptions";
import DoctorMedicalRecords from "./pages/DoctorPages/MedicalRecords";
import DoctorReports from "./pages/DoctorPages/Reports";
import DoctorNotifications from "./pages/DoctorPages/Notifications";

// Import Patient Layout & Pages
import PatientLayout from "./containers/PatientLayout";
import PatientDashboard from "./pages/PatientPages/Dashboard";
import PatientAppointments from "./pages/PatientPages/Appointments";
import PatientPrescriptions from "./pages/PatientPages/Prescriptions";
import PatientMedicalRecords from "./pages/PatientPages/MedicalRecords";
import PatientProfile from "./pages/PatientPages/Profile";
import PatientNotifications from "./pages/PatientPages/Notifications";
import PatientMessages from "./pages/PatientPages/MessageDoctor"; // To be implemented

// Import the ResetPassword component
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

import "./assets/styles/global.css";

// Import the AuthProvider
import { AuthProvider } from "./contexts/AuthContext";
import Billing from "./pages/PatientPages/Billing";

// Wrapper for the AuthCheck functionality
const AuthCheckWrapper = ({ redirectTo, children }) => {
  // useLocation hook can only be used in a component within Router
  return <AuthCheck redirectTo={redirectTo}>{children}</AuthCheck>;
};

// Create a component to check auth state with access to location
const AuthCheck = ({ children, redirectTo }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // This ensures we don't redirect away from login page
    if (location.pathname === "/login") {
      return;
    }

    // Simple token check without tokenUtils
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location]);

  // Wait until auth state is checked
  if (isAuthenticated === null) {
    return <Spinner center size="medium" />;
  }

  // Don't redirect if we're already at the login page
  if (!isAuthenticated && location.pathname === redirectTo) {
    return children;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={redirectTo} state={{ from: location }} replace />
  );
};

// Role-based route checker component
const RoleBasedRoute = ({ requiredRole, children }) => {
  const [authorized, setAuthorized] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    setAuthorized(userType === requiredRole);
  }, [requiredRole]);

  if (authorized === null) {
    return <Spinner center size="medium" />;
  }

  return authorized ? (
    children
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  );
};

// Create a simple RedirectBasedOnRole component that doesn't immediately redirect
const RedirectBasedOnRole = () => {
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token) {
      setDestination("/login");
      return;
    }

    switch (userType) {
      case "admin":
        setDestination("/admin/dashboard");
        break;
      case "doctor":
        setDestination("/doctor");
        break;
      case "patient":
        setDestination("/patient");
        break;
      default:
        setDestination("/unauthorized");
        break;
    }
  }, []);

  if (destination === null) {
    return <Spinner center size="medium" />;
  }

  return <Navigate to={destination} replace />;
};

// Home component with safer redirect
const Home = () => {
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setRedirect(token ? "/redirect" : "/login");
  }, []);

  if (redirect === null) {
    return <Spinner center size="medium" />;
  }

  return <Navigate to={redirect} replace />;
};

const App = () => {
  // Add a mechanism to prevent immediate token checking
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // This delay allows the app to fully render before checking tokens
    // Which helps prevent immediate redirects
    const timer = setTimeout(() => {
      setInitialized(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  if (!initialized) {
    return (
      <div className="app-loading-container">
        <Spinner center size="large" />
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Default route */}
          <Route path="/" element={<Home />} />

          {/* Role-based redirect */}
          <Route path="/redirect" element={<RedirectBasedOnRole />} />

          {/* Admin routes - with role verification */}
          <Route
            path="/admin"
            element={
              <AuthCheckWrapper redirectTo="/login">
                <RoleBasedRoute requiredRole="admin">
                  <AdminLayout />
                </RoleBasedRoute>
              </AuthCheckWrapper>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route
              path="specializations"
              element={<SpecializationManagement />}
            />
            <Route path="doctors" element={<DoctorsList />} />
            <Route path="patients" element={<PatientsList />} />
            <Route path="appointments" element={<AppointmentManagement />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Doctor routes - with role verification */}
          <Route
            path="/doctor"
            element={
              <AuthCheckWrapper redirectTo="/login">
                <RoleBasedRoute requiredRole="doctor">
                  <DoctorLayout />
                </RoleBasedRoute>
              </AuthCheckWrapper>
            }
          >
            <Route index element={<DoctorDashboard />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="prescriptions" element={<DoctorPrescriptions />} />
            <Route path="medical-records" element={<DoctorMedicalRecords />} />
            <Route path="reports" element={<DoctorReports />} />
            <Route path="notifications" element={<DoctorNotifications />} />
          </Route>

          {/* Patient routes - with role verification */}
          <Route
            path="/patient"
            element={
              <AuthCheckWrapper redirectTo="/login">
                <RoleBasedRoute requiredRole="patient">
                  <PatientLayout />
                </RoleBasedRoute>
              </AuthCheckWrapper>
            }
          >
            <Route index element={<PatientDashboard />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="prescriptions" element={<PatientPrescriptions />} />
            <Route path="medical-records" element={<PatientMedicalRecords />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="notifications" element={<PatientNotifications />} />
            <Route path="messages" element={<PatientMessages />} />
            <Route path="billing" element={<Billing />} />
            {/* To be implemented */}
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
