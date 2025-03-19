// src/components/common/Card.js
import React from "react";
import "./Card.css";

const Card = ({
  children,
  title,
  subtitle,
  className = "",
  headerRight,
  footer,
  noPadding = false,
  bordered = true,
}) => {
  return (
    <div className={`card ${bordered ? "card-bordered" : ""} ${className}`}>
      {(title || subtitle || headerRight) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerRight && (
            <div className="card-header-right">{headerRight}</div>
          )}
        </div>
      )}
      <div className={`card-body ${noPadding ? "no-padding" : ""}`}>
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
