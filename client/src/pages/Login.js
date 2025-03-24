import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Spinner from "../components/common/Spinner";
import { API } from "../constants/api";
import authAPI from "../api/auth";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "", // Keep password field but make it optional in validation
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already logged in or has remembered credentials
  useEffect(() => {
    // Add a small delay to prevent immediate redirects
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");

      if (token) {
        // Check if the token is valid before redirecting
        try {
          const tokenData = JSON.parse(atob(token.split(".")[1]));
          const expiryTime = tokenData.exp * 1000; // Convert to milliseconds

          if (Date.now() < expiryTime) {
            navigate("/redirect");
            return;
          } else {
            // Token expired, clear it
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userType");
          }
        } catch (e) {
          // Invalid token format, clear it
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userType");
        }
      }

      // Load remembered credentials if they exist
      const rememberedUser = localStorage.getItem("rememberedUser");
      if (rememberedUser) {
        try {
          const userData = JSON.parse(rememberedUser);
          setFormData(userData);
          setRememberMe(true);
        } catch (e) {
          localStorage.removeItem("rememberedUser");
        }
      }

      setIsCheckingAuth(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear errors when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
    if (loginError) {
      setLoginError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation - more comprehensive
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation is now optional - only validate if password is entered
    // Skip validation in forgot password mode
    if (
      !forgotPasswordMode &&
      formData.password &&
      formData.password.length < 6
    ) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setLoginError("");

    try {
      const requestBody = {
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch(API.USERS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Handle "Remember me" functionality
      if (rememberMe) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({
            email: formData.email,
            password: formData.password,
          })
        );
      } else {
        localStorage.removeItem("rememberedUser");
      }

      // Store token and user role
      localStorage.setItem("token", data.token);

      try {
        // Decode JWT to get user role
        const userRole = JSON.parse(atob(data.token.split(".")[1])).role;
        localStorage.setItem("userType", userRole);
      } catch (error) {
        console.error("Error decoding token:", error);
      }

      // Redirect based on user role
      navigate("/redirect");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: "Please enter your email address" });
      return;
    }

    setLoading(true);
    try {
      // Use authAPI instead of direct fetch for consistency
      await authAPI.requestPasswordReset(formData.email);

      // Show success message
      setLoginError("");
      alert(
        `If an account exists for ${formData.email}, a password reset link will be sent.`
      );
      setForgotPasswordMode(false);
    } catch (error) {
      setLoginError("Unable to process your request. Please try again later.");
      console.error("Password reset error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPasswordMode(!forgotPasswordMode);
    setLoginError("");
    setErrors({});
  };

  // Show a loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="login-container">
        <Spinner center size="large" />
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card className="login-card">
          <div className="login-header">
            <h2>Welcome to CareConnect</h2>
            <p>
              {forgotPasswordMode
                ? "Reset your password"
                : "Sign in to your account"}
            </p>
          </div>

          {loginError && (
            <div className="login-error">
              <i className="fas fa-exclamation-circle"></i> {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            {!forgotPasswordMode && (
              <Input
                label="Password (if applicable)"
                type="password"
                id="password"
                placeholder="Enter your password if required"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
            )}

            <div className="login-options">
              {!forgotPasswordMode && (
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />{" "}
                  Remember me
                </label>
              )}
              <a
                href="#"
                onClick={toggleForgotPassword}
                className="forgot-password"
              >
                {forgotPasswordMode ? "Back to login" : "Forgot Password?"}
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              loading={loading}
            >
              {forgotPasswordMode ? "Send Reset Link" : "Sign In"}
            </Button>
          </form>

          <div className="login-footer">
            <p>
              © {new Date().getFullYear()} CareConnect. All rights reserved.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
