import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Spinner from "../components/common/Spinner";
import authAPI from "../api/auth";
import "./Login.css"; // Reuse login styles
import "./ResetPassword.css"; // Add the new CSS file

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        setMessage({
          type: "error",
          text: "Invalid password reset link. Please request a new one.",
        });
        setIsVerifying(false);
        return;
      }

      try {
        await authAPI.verifyResetToken(token);
        setTokenValid(true);
        setIsVerifying(false);
      } catch (error) {
        setTokenValid(false);
        setMessage({
          type: "error",
          text: "This password reset link is invalid or has expired. Please request a new one.",
        });
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

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
  };

  const validateForm = () => {
    const newErrors = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await authAPI.resetPassword(token, formData.password);

      setMessage({
        type: "success",
        text: "Your password has been reset successfully. You can now log in with your new password.",
      });

      // Clear form
      setFormData({ password: "", confirmPassword: "" });

      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to reset password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="login-container">
        <Spinner center size="large" />
        <p className="text-center mt-3">Verifying your reset link...</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          <Card className="login-card">
            <div className="login-header">
              <h2>Password Reset Failed</h2>
            </div>

            <div className={`message error`}>
              <i className="fas fa-exclamation-circle"></i> {message.text}
            </div>

            <div className="text-center mt-4">
              <Link to="/login" className="btn btn-primary">
                Return to Login
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card className="login-card">
          <div className="login-header">
            <h2>Reset Your Password</h2>
            <p>Please enter your new password.</p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.type === "error" ? (
                <i className="fas fa-exclamation-circle"></i>
              ) : (
                <i className="fas fa-check-circle"></i>
              )}{" "}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="New Password"
              type="password"
              id="password"
              placeholder="Enter your new password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              loading={loading}
            >
              Reset Password
            </Button>
          </form>

          <div className="login-footer mt-4">
            <p>
              Remember your password? <Link to="/login">Log in here</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
