import React, { useState } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "./CSS/LoginSignup.css";
import hero1_image from "../components/assets/hero1_image.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await login(form);
      const user = res.user;

      // Kiểm tra trạng thái của tài khoản
      if (user.status !== "active") {
        setErrorMsg(
          "Your account is inactive. Please contact the administrator."
        );
        return;
      }
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));

      const pending = JSON.parse(sessionStorage.getItem("pendingAddToCart"));

      if (pending) {
        const { itemId } = pending;
        console.log("Thêm lại sản phẩm sau khi login:", itemId);
        sessionStorage.removeItem("pendingAddToCart");
        navigate(`/product/${itemId}`); // Điều hướng tới trang sản phẩm
        window.location.reload();
        return;
      }
      navigate("/"); // Chuyển về trang chủ hoặc dashboard
      window.location.reload();
    } catch (error) {
      setErrorMsg(error || "Đăng nhập thất bại!");
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
        <h1>Log In</h1>
        <div className="login-signup-fields">
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
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        </div>
        <button onClick={handleLogin}>Log In</button>
        <p className="login-signup-login">
          Don't have an account?{" "}
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <span>Sign Up Here</span>
          </Link>
        </p>
      </div>
      <div className="login-signup-image">
        <img src={hero1_image} alt="Hero" />
      </div>
    </div>
  );
};

export default Login;
