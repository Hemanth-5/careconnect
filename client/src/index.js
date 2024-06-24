import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Records from "./pages/Records";
import Appointment from "./pages/Appointment";
import Settings from "./pages/Settings";

const mainRoute = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/doctors-panel",
    component: Doctors,
  },
  {
    path: "/patients-panel",
    component: Patients,
  },
  {
    path: "/appointments",
    component: Appointment,
  },
  {
    path: "/records",
    component: Records,
  },
  {
    path: "/settings",
    component: Settings,
  },
];

ReactDOM.render(
  <BrowserRouter>
    {/* <ScrollToTop /> */}
    <Routes>
      {mainRoute.map((route, index) => (
        <Route key={index} path={route.path} element={<route.component />} />
      ))}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
