import React from "react";
import "./password.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { changePassword } from "../../services/auth";
// import { getStorageData } from "../../helpers/stored";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //   const user = getStorageData("user", {});

  const handleChangePassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Please fill in all information !");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password does not match !");
      return;
    }

    // const response = await changePassword(
    //   user._id,
    //   newPassword,
    //   currentPassword
    // );

    // if (response.success) {
    //   setSuccessMessage("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
    //   setTimeout(() => navigate("/auth/login"), 2000);
    // } else {
    //   setErrorMessage(response.message);
    // }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const result = await changePassword({
        userId: user?.id || user?._id,
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      setSuccessMessage(result.message || "Password changed successfully!");
      // Optionally, redirect to login:
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <>
      <HelmetProvider>
        <title>Change Password</title>
      </HelmetProvider>
      <div className="change-password-container">
        <div className="change-password-box">
          <h1 className="change-password-title">Change Password</h1>
          <div className="change-password-fields">
            <div className="input-field">
              <label className="label">Current password:</label>
              <div className="input-wrapper">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input"
                  placeholder="Enter current password"
                />
                <div
                  className="eye-icon"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <div className="input-field">
              <label className="label">New password:</label>
              <div className="input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input"
                  placeholder="Enter a new password"
                />
                <div
                  className="eye-icon"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <div className="input-field">
              <label className="label">Confirm new password:</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="Re-enter new password"
                />
                <div
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}

            <button onClick={handleChangePassword} className="submit-button">
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
