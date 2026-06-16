import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaHospital, FaBars, FaTimes, FaUserCircle, FaSignOutAlt,
  FaTachometerAlt, FaCalendarAlt, FaComments, FaFolderOpen,
} from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "doctor") return "/doctor/dashboard";
    return "/patient/dashboard";
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <FaHospital className="logo-icon" />
          <span>HealthCare<span className="logo-plus">+</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <Link to="/" className={isActive("/") && location.pathname === "/" ? "nav-link active" : "nav-link"}>Home</Link>
          <Link to="/doctors" className={isActive("/doctors") ? "nav-link active" : "nav-link"}>Find Doctors</Link>
          <Link to="/symptom-checker" className={isActive("/symptom-checker") ? "nav-link active" : "nav-link"}>Symptom Checker</Link>
          <Link to="/health-news" className={isActive("/health-news") ? "nav-link active" : "nav-link"}>Health News</Link>
          <Link to="/about" className={isActive("/about") ? "nav-link active" : "nav-link"}>About</Link>
        </div>

        {/* Auth */}
        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FaUserCircle size={20} />
                <span>{user.name.split(" ")[0]}</span>
                <span className={`role-badge role-${user.role}`}>{user.role}</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown">
                  <Link to={getDashboardLink()} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <FaTachometerAlt /> Dashboard
                  </Link>
                  {user.role === "patient" && (
                    <>
                      <Link to="/my-appointments" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <FaCalendarAlt /> My Appointments
                      </Link>
                      <Link to="/medical-records" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <FaFolderOpen /> Medical Records
                      </Link>
                    </>
                  )}
                  <Link to="/messages" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <FaComments /> Messages
                  </Link>
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <FaUserCircle /> Profile
                  </Link>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/doctors" className="mobile-link" onClick={() => setMenuOpen(false)}>Find Doctors</Link>
          <Link to="/symptom-checker" className="mobile-link" onClick={() => setMenuOpen(false)}>Symptom Checker</Link>
          <Link to="/health-news" className="mobile-link" onClick={() => setMenuOpen(false)}>Health News</Link>
          <Link to="/about" className="mobile-link" onClick={() => setMenuOpen(false)}>About</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} className="mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button className="mobile-link logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
