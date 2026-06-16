import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaHospital, FaTachometerAlt, FaCalendarAlt, FaUserMd,
  FaFolderOpen, FaComments, FaUser, FaSignOutAlt,
  FaFlask, FaNewspaper, FaSearch, FaUsers, FaChartBar,
  FaCheckCircle, FaBars, FaTimes, FaClock, FaHeartbeat,
} from "react-icons/fa";
import "./Sidebar.css";

const patientLinks = [
  { to: "/patient/dashboard",  icon: <FaTachometerAlt />, label: "Dashboard"        },
  { to: "/doctors",            icon: <FaSearch />,        label: "Find Doctors"     },
  { to: "/my-appointments",    icon: <FaCalendarAlt />,   label: "My Appointments"  },
  { to: "/medical-records",    icon: <FaFolderOpen />,    label: "Medical Records"  },
  { to: "/symptom-checker",    icon: <FaFlask />,         label: "Symptom Checker"  },
  { to: "/messages",           icon: <FaComments />,      label: "Messages"         },
  { to: "/health-news",        icon: <FaNewspaper />,     label: "Health News"      },
  { to: "/profile",            icon: <FaUser />,          label: "Profile"          },
];

const doctorLinks = [
  { to: "/doctor/dashboard",    icon: <FaTachometerAlt />, label: "Dashboard"       },
  { to: "/doctor/appointments", icon: <FaCalendarAlt />,   label: "Appointments"    },
  { to: "/doctor/profile",      icon: <FaUserMd />,        label: "My Profile"      },
  { to: "/messages",            icon: <FaComments />,      label: "Messages"        },
  { to: "/profile",             icon: <FaUser />,          label: "Account"         },
];

const adminLinks = [
  { to: "/admin/dashboard",    icon: <FaChartBar />,      label: "Dashboard"        },
  { to: "/admin/doctors",      icon: <FaUserMd />,        label: "Manage Doctors"   },
  { to: "/admin/users",        icon: <FaUsers />,         label: "Manage Users"     },
  { to: "/admin/appointments", icon: <FaCalendarAlt />,   label: "Appointments"     },
  { to: "/profile",            icon: <FaUser />,          label: "Profile"          },
];

const roleLinks = { patient: patientLinks, doctor: doctorLinks, admin: adminLinks };
const roleColors = {
  patient: { bg: "var(--sky-600)",  badge: "var(--sky-100)",  text: "var(--sky-700)"  },
  doctor:  { bg: "#059669",         badge: "#d1fae5",         text: "#065f46"         },
  admin:   { bg: "#7c3aed",         badge: "#ede9fe",         text: "#5b21b6"         },
};

export default function Sidebar({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return <>{children}</>;

  const links  = roleLinks[user.role]  || [];
  const colors = roleColors[user.role] || roleColors.patient;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <div className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <FaHospital className="sidebar-logo-icon" />
        {!collapsed && <span>HealthCare<span style={{ color: "var(--sky-300)" }}>+</span></span>}
        <button className="sidebar-toggle desktop-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: colors.bg }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user.name}</p>
            <span className="sidebar-role-badge" style={{ background: colors.badge, color: colors.text }}>
              {user.role}
            </span>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="sidebar-avatar-sm" style={{ background: colors.bg }}>
          {user.name?.[0]?.toUpperCase()}
        </div>
      )}

      {/* Nav links */}
      <nav className="sidebar-nav">
        {!collapsed && <p className="sidebar-section-label">MENU</p>}
        {links.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-link ${isActive(to) ? "sidebar-link-active" : ""}`}
            onClick={() => setMobileOpen(false)}
            title={collapsed ? label : ""}
          >
            <span className="sidebar-link-icon">{icon}</span>
            {!collapsed && <span className="sidebar-link-label">{label}</span>}
            {isActive(to) && !collapsed && <span className="sidebar-active-dot" />}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        {!collapsed && <p className="sidebar-section-label">ACCOUNT</p>}
        <Link to="/" className="sidebar-link" title={collapsed ? "Home" : ""} onClick={() => setMobileOpen(false)}>
          <span className="sidebar-link-icon"><FaHeartbeat /></span>
          {!collapsed && <span className="sidebar-link-label">Go to Home</span>}
        </Link>
        <button className="sidebar-link sidebar-logout" onClick={handleLogout} title={collapsed ? "Logout" : ""}>
          <span className="sidebar-link-icon"><FaSignOutAlt /></span>
          {!collapsed && <span className="sidebar-link-label">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      {/* Desktop sidebar */}
      <div className="sidebar-wrapper desktop-sidebar">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}>
          <div className="sidebar-wrapper mobile-sidebar" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`dashboard-main ${collapsed ? "dashboard-main-expanded" : ""}`}>
        {/* Mobile topbar */}
        <div className="mobile-topbar">
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
            <FaBars />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "var(--sky-700)" }}>
            <FaHospital style={{ color: "var(--sky-500)" }} />
            HealthCare+
          </div>
          <div className="sidebar-avatar" style={{ background: colors.bg, width: 32, height: 32, fontSize: "0.875rem" }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
