import React, { useState } from "react";
import { login } from "../service/auth.service"; // Import the login function (username, password)
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [role, setRole] = useState(""); // Selected role after login
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call the login API with username and password
      const data = await login(username, password);

      // Store JWT token (if returned)
      localStorage.setItem("authToken", data.token);

      // After successful login, set login status to true
      setIsLoggedIn(true);
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  const handleRoleSelect = () => {
    // Save the selected role (this can be stored in localStorage or context)
    localStorage.setItem("role", role);

    // Navigate to the correct dashboard based on the role
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "doctor") {
      navigate("/doctor/dashboard");
    } else if (role === "patient") {
      navigate("/patient/dashboard");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="login-error">{error}</p>}
      {!isLoggedIn ? (
        <form onSubmit={handleLogin} className="login-form">
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <h3>Select Your Role</h3>
          <select
            onChange={(e) => setRole(e.target.value)}
            value={role}
            className="login-role-select"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
          <button onClick={handleRoleSelect} disabled={!role}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
