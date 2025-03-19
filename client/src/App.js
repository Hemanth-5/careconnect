import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Spinner from "./components/common/Spinner";

// Import Admin Pages
import AdminLayout from "./containers/AdminLayout";
import AdminDashboard from "./pages/AdminPages/Dashboard";
import UserManagement from "./pages/AdminPages/UserManagement";
// Import additional admin pages as they're created
import SpecializationManagement from "./pages/AdminPages/SpecializationManagement";
import DoctorsList from "./pages/AdminPages/DoctorsList";
import PatientsList from "./pages/AdminPages/PatientsList";
import AppointmentManagement from "./pages/AdminPages/AppointmentManagement";
import AnalyticsDashboard from "./pages/AdminPages/AnalyticsDashboard";

// Import the ResetPassword component
import ResetPassword from "./pages/ResetPassword";

import "./assets/styles/global.css";

// Wrapper for the AuthCheck functionality
const AuthCheckWrapper = ({ redirectTo, children }) => {
  // useLocation hook can only be used in a component within Router
  return <AuthCheck redirectTo={redirectTo}>{children}</AuthCheck>;
};

// Create a component to check auth state with access to location
const AuthCheck = ({ children, redirectTo }) => {
  const token = localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // This ensures we don't redirect away from login page
    if (location.pathname === "/login") {
      return;
    }

    setIsAuthenticated(!!token);
  }, [location, token]);

  // Wait until auth state is checked
  if (isAuthenticated === null) {
    return <Spinner center size="medium" />; // Replace null with Spinner
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

// Create a simple RedirectBasedOnRole component that doesn't immediately redirect
const RedirectBasedOnRole = () => {
  const [destination, setDestination] = useState(null);
  const location = useLocation();

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
        setDestination("/doctor/dashboard");
        break;
      case "patient":
        setDestination("/patient/dashboard");
        break;
      default:
        setDestination("/unauthorized");
        break;
    }
  }, []);

  if (destination === null) {
    return <Spinner center size="medium" />; // Replace null with Spinner
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
    return <Spinner center size="medium" />; // Replace null with Spinner
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
    ); // Replace div with styled spinner
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Role-based redirect */}
        <Route path="/redirect" element={<RedirectBasedOnRole />} />

        {/* Default route */}
        <Route path="/" element={<Home />} />

        {/* Admin routes - now using AdminLayout */}
        <Route
          path="/admin"
          element={
            <AuthCheckWrapper redirectTo="/login">
              <AdminLayout />
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
        </Route>

        {/* Doctor routes placeholder */}
        <Route
          path="/doctor/dashboard"
          element={
            <AuthCheckWrapper redirectTo="/login">
              <div>Doctor Dashboard Placeholder</div>
            </AuthCheckWrapper>
          }
        />

        {/* Patient routes placeholder */}
        <Route
          path="/patient/dashboard"
          element={
            <AuthCheckWrapper redirectTo="/login">
              <div>Patient Dashboard Placeholder</div>
            </AuthCheckWrapper>
          }
        />

        {/* Add this route to your Routes component */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Any other route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
