import React, { useState } from "react";
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import hero1_image from "../components/assets/hero1_image.png";
import "./CSS/LoginSignup.css";
import { Link } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isAgreed, setIsAgreed] = useState(false); // Thêm state cho checkbox
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!isAgreed) return; // Nếu chưa tick thì không cho đăng ký
    try {
      const res = await register(form);
      setSuccessMsg(
        "Registration successful! Please check your email to verify your account."
      );
      setErrorMsg("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrorMsg(error || "Đăng ký thất bại!");
      setSuccessMsg("");
    }
  };

  const getInputClassName = (inputName) => {
    return `input-field ${window.innerWidth >= 768 ? "md" : ""} ${
      focusedInput === inputName ? "focused" : ""
    }`;
  };

  return (
    <div className="login-signup">
      <div className="login-signup-container">
        <h1>Sign Up</h1>
        <div className="login-signup-fields">
          <div className="login-signup-name">
            <p>
              Your Name <span style={{ color: "red" }}>*</span>
            </p>
            <input
              type="text"
              placeholder="Your Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={getInputClassName("name")}
              onFocus={() => setFocusedInput("name")}
              onBlur={() => setFocusedInput(null)}
            />
          </div>
          <div className="login-signup-mail">
            <p>
              Email Address <span style={{ color: "red" }}>*</span>
            </p>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={getInputClassName("email")}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
            />
          </div>
          <div className="login-signup-password">
            <p>
              Password <span style={{ color: "red" }}>*</span>
            </p>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={getInputClassName("password")}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
              />
              <div
                className="login-signup-showPassword"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={27} /> : <FaEye size={25} />}
              </div>
            </div>
          </div>
        </div>
        {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <div className="login-signup-agree" style={{ marginTop: "10px" }}>
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={() => setIsAgreed(!isAgreed)}
            id="agree"
          />
          <label htmlFor="agree" style={{ marginLeft: "8px" }}>
            By continuing, I agree to the terms of use & privacy policy.
          </label>
        </div>

        <button
          onClick={handleRegister}
          disabled={!isAgreed} // disable nút khi chưa tick
          style={{
            marginTop: "15px",
            cursor: isAgreed ? "pointer" : "not-allowed",
            opacity: isAgreed ? 1 : 0.6,
          }}
        >
          Continue
        </button>

        <p className="login-signup-login">
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none" }}>
            <span>Log In Here</span>
          </Link>
        </p>
      </div>
      <div className="login-signup-image">
        <img src={hero1_image} alt="Hero" />
      </div>
    </div>
  );
};

export default Signup;
