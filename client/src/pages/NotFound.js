import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Go to Homepage
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
