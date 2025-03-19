// src/components/common/Input.js
import React from "react";
import "./Input.css";

const Input = ({
  label,
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = "",
  labelClassName = "",
  inputClassName = "",
  ...rest
}) => {
  return (
    <div className={`input-group ${className} ${error ? "has-error" : ""}`}>
      {label && (
        <label htmlFor={id} className={`input-label ${labelClassName}`}>
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name || id}
        className={`input-field ${inputClassName}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        {...rest}
      />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default Input;
