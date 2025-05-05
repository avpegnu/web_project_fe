// import React, { useState } from "react";
// import "./LoginHere.css";
// import logo from "../assets/logo.png";

// const LoginHere = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [focusedInput, setFocusedInput] = useState(null);

//   const getInputClassName = (inputName) => {
//     return `input-field ${window.innerWidth >= 768 ? "md" : ""} ${
//       focusedInput === inputName ? "focused" : ""
//     }`;
//   };

//   return (
//     <div className="login-here-container">
//       <div className="login-here-sayhi">
//         <img src={logo} alt="Logo" />
//         <h1>Welcome Back!</h1>
//       </div>
//       <div className="login-here-fields">
//         <div className="login-here-email">
//           <p>
//             Your Address <span style={{ color: "red" }}>*</span>
//           </p>
//           <input
//             type="text"
//             placeholder="Your Address"
//             name="email"
//             className={getInputClassName("email")}
//             onFocus={() => setFocusedInput("email")}
//             onBlur={() => setFocusedInput(null)}
//           />
//         </div>
//         <div className="login-here-password">
//           <p>
//             Password <span style={{ color: "red" }}>*</span>
//           </p>
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             className={getInputClassName("password")}
//             onFocus={() => setFocusedInput("password")}
//             onBlur={() => setFocusedInput(null)}
//           />
//           {/* Checkbox để bật/tắt hiển thị mật khẩu */}
//           <div className="show-password">
//             <input
//               type="checkbox"
//               id="togglePassword"
//               checked={showPassword}
//               onChange={() => setShowPassword((prev) => !prev)}
//             />
//             <label htmlFor="togglePassword">Hiển thị mật khẩu</label>
//           </div>
//         </div>
//       </div>
//       <button className="btn">Login</button>
//       <div className="login-here-forgot">
//         <p className="login-here-login">
//           Forgot your password? <a href="#">Click here</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginHere;
