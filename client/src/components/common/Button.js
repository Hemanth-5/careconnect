// src/components/common/Button.js
import React from "react";
import "./Button.css";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  ...rest
}) => {
  const buttonClasses = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? "btn-block" : "",
    loading ? "btn-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <span className="spinner"></span>}
      {children}
    </button>
  );
};

export default Button;
