import React from "react";
import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const handleGoogleLogin = async (credentialResponse) => {
    const { credential } = credentialResponse;
    console.log({ credential: credential });

    try {
      const response = await fetch("http://localhost:5001/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credential }),
      });

      const data = await response.json();
      console.log({ data });
    } catch (error) {
      console.log(error);
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
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
        ;
      </div>
    </section>
  );
};

export default Login;
