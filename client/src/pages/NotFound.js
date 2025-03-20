import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>

        <h1>404</h1>
        <h2>Page Not Found</h2>

        <p>The page you are looking for doesn't exist or has been moved.</p>

        <div className="not-found-actions">
          <Link to="/">
            <Button variant="primary">
              <i className="fas fa-home"></i> Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
