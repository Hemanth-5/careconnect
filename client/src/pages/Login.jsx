import React from "react";
import "./Login.css";

const Login = () => {
  const handleGoogleSignIn = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/google/callback"
      );
      const data = await response.json();
      // Redirect user to Google OAuth URL
      window.location.href = data.url;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      // Handle error
    }
  };

  return (
    <section className="login" id="login">
      <div className="container">
        <div className="image-container">
          <img
            src="../../assets/careconnect-logo.svg"
            alt="careconnect-logo"
            className="centered-image"
          />
        </div>
        <div className="row">
          <button onClick={handleGoogleSignIn} className="google-signin-btn">
            Sign in with Google
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
