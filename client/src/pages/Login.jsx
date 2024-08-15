import React, { useState } from "react";
import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async (credentialResponse) => {
    const { credential } = credentialResponse;
    console.log(credential); // Handle the credential, e.g., send it to the server

    try {
      const response = await fetch("http://localhost:5001/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credential }),
      });

      const data = await response.json();
      console.log(data); // Handle the response, e.g., save the JWT token, redirect, etc.
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  const handleNormalLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data); // Handle the response, e.g., save the JWT token, redirect, etc.
    } catch (error) {
      console.error("Error logging in:", error);
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
          <form onSubmit={handleNormalLogin} className="login-form">
            <h3>Login</h3>
            <input
              type="email"
              className="box"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="box"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn">
              Login
            </button>
          </form>
        </div>
        <div className="google-btn">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log("Login Failed");
            }}
            useOneTap
          />
        </div>
      </div>
    </section>
  );
};

export default Login;
