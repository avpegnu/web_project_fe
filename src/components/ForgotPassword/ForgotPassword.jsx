import React, { useState } from "react";
import "./ForgotPassword.css";
import { Link } from "react-router-dom";
import hero1_image from "../assets/hero1_image.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  const getInputClassName = (inputName) => {
    return `input-field ${window.innerWidth >= 768 ? "md" : ""} ${
      focusedInput === inputName ? "focused" : ""
    }`;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="login-signup">
      <div className="login-signup-container">
        <h1>Forgot Password</h1>
        <div className="login-signup-fields">
          <div className="login-signup-mail">
            <p>
              Email Address <span style={{ color: "red" }}>*</span>
            </p>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
              className={getInputClassName("email")}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
            />
          </div>
        </div>
        <button>Send Reset Link</button>
        <p className="login-signup-login">
          Remember your password?{" "}
          <Link to="/login" style={{ textDecoration: "none" }}>
            <span>Log in here</span>
          </Link>
        </p>
      </div>
      <div className="login-signup-image">
        <img src={hero1_image} alt="Hero" />
      </div>
    </div>
  );
};

export default ForgotPassword;
