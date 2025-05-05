import React, { useContext, useRef, useState, useEffect } from "react";
import "./navbar.css";
import logo from "../assets/logo.png";
import cart_icon from "../assets/cart_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import nav_dropdown from "../assets/nav_dropdown.png";
import { logout } from "../../services/auth";
import { getStorageData, removeStorageData } from "../../helpers/stored";
import { IoPersonCircleOutline } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate();
  const { getTotalCartItems, resetCart, loadCartFromStorage } =
    useContext(ShopContext);
  const menuRef = useRef();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const userData = getStorageData("user", null);
  useEffect(() => {
    if (userData && userData.name) {
      setUser(userData);
      loadCartFromStorage();
    } else {
      setUser(null);
    }
  }, []);

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const handleLogout = async () => {
    try {
      await logout(); // Gọi API logout
      removeStorageData("user");
      removeStorageData("accessToken");
      resetCart(); // Xóa giỏ hàng
      setUser(null); // Cập nhật lại trạng thái người dùng
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleCartClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <Link
          style={{
            textDecoration: "none",
            color: "currentColor",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          to="/"
        >
          <img src={logo} alt="logo" style={{ width: "15%" }} />
          <p>JYSTORE</p>
        </Link>
      </div>

      <img
        className="nav-dropdown"
        onClick={dropdown_toggle}
        src={nav_dropdown}
        alt="dropdown"
      />
      <ul ref={menuRef} className="nav-menu">
        <li>
          <Link
            style={{ textDecoration: "none", color: "currentColor" }}
            to="/"
          >
            Shop
          </Link>
        </li>
        <li>
          <Link
            style={{ textDecoration: "none", color: "currentColor" }}
            to="/mens"
          >
            Men
          </Link>
        </li>
        <li>
          <Link
            style={{ textDecoration: "none", color: "currentColor" }}
            to="/womens"
          >
            Women
          </Link>
        </li>
        <li>
          <Link
            style={{ textDecoration: "none", color: "currentColor" }}
            to="/kids"
          >
            Kids
          </Link>
        </li>
      </ul>

      <div className="nav-login-cart">
        {!user ? (
          <>
            <Link
              style={{ textDecoration: "none", color: "currentColor" }}
              to="/login"
            >
              <button className="login-button">Log in</button>
            </Link>
          </>
        ) : (
          <div className="dropdown-container">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="dropdown-button"
            >
              <IoPersonCircleOutline size={30} className="user-icon" />
              <span className="user-name">{user.name} </span>
              <span>▼</span>
            </button>

            {isOpen && (
              <ul className="dropdown-menu">
                <li className="dropdown-item">
                  <Link
                    style={{ textDecoration: "none", color: "currentColor" }}
                    to="/profile"
                  >
                    User information
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link
                    style={{ textDecoration: "none", color: "currentColor" }}
                    to="/order"
                  >
                    My orders
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link
                    style={{ textDecoration: "none", color: "currentColor" }}
                    to="/change-password"
                  >
                    Change password
                  </Link>
                </li>
                <li className="dropdown-item" onClick={handleLogout}>
                  <Link
                    style={{ textDecoration: "none", color: "currentColor" }}
                    to="/"
                  >
                    Log out
                  </Link>
                </li>
              </ul>
            )}
          </div>
        )}
        <div onClick={handleCartClick} style={{ cursor: "pointer" }}>
          <img src={cart_icon} alt="cart icon" />
        </div>

        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
