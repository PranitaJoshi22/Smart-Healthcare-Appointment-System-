import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import api from "./utils/api";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Sidebar from "./components/layout/Sidebar";

// Public pages
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SymptomChecker from "./pages/SymptomChecker";
import HealthNews from "./pages/HealthNews";
import About from "./pages/About";

// Patient pages
import PatientDashboard from "./pages/patient/Dashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";
import MedicalRecords from "./pages/patient/MedicalRecords";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";

// Doctor pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorProfile from "./pages/doctor/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminDoctors from "./pages/admin/Doctors";
import AdminUsers from "./pages/admin/Users";
import AdminAppointments from "./pages/admin/Appointments";

// Protected route
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"60vh" }}>
      <div className="loader" style={{ width:40, height:40, borderWidth:4 }} />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// Dashboard route — wraps content with Sidebar, hides global Footer
const DashboardRoute = ({ children, roles }) => (
  <ProtectedRoute roles={roles}>
    <Sidebar>{children}</Sidebar>
  </ProtectedRoute>
);

// Backend status banner
function BackendBanner() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    api.get("/news").then(() => setOffline(false)).catch(() => setOffline(true));
  }, []);
  if (!offline) return null;
  return (
    <div style={{ background:"#fef3c7", borderBottom:"2px solid #f59e0b", padding:"0.5rem 1.5rem", textAlign:"center", fontSize:"0.875rem", color:"#92400e", fontWeight:600 }}>
      ⚠️ Backend not reachable — run <code style={{ background:"#fde68a", padding:"0.1rem 0.4rem", borderRadius:4 }}>cd backend &amp;&amp; npm run dev</code> and make sure MongoDB is running.
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const isDashboard = user && [
    "/patient/dashboard","/my-appointments","/medical-records",
    "/doctor/dashboard","/doctor/appointments","/doctor/profile",
    "/admin/dashboard","/admin/doctors","/admin/users","/admin/appointments",
    "/messages","/profile",
  ].some(p => window.location.pathname.startsWith(p));

  return (
    <Router>
      <Navbar />
      <BackendBanner />

      <Routes>
        {/* ── Public (with footer) ── */}
        <Route path="/" element={<WithFooter><Home /></WithFooter>} />
        <Route path="/doctors" element={<WithFooter><Doctors /></WithFooter>} />
        <Route path="/doctors/:id" element={<WithFooter><DoctorDetail /></WithFooter>} />
        <Route path="/login" element={<WithFooter><Login /></WithFooter>} />
        <Route path="/register" element={<WithFooter><Register /></WithFooter>} />
        <Route path="/symptom-checker" element={<WithFooter><SymptomChecker /></WithFooter>} />
        <Route path="/health-news" element={<WithFooter><HealthNews /></WithFooter>} />
        <Route path="/about" element={<WithFooter><About /></WithFooter>} />

        {/* ── Patient dashboard (sidebar, no footer) ── */}
        <Route path="/patient/dashboard"  element={<DashboardRoute roles={["patient"]}><PatientDashboard /></DashboardRoute>} />
        <Route path="/my-appointments"    element={<DashboardRoute roles={["patient"]}><MyAppointments /></DashboardRoute>} />
        <Route path="/medical-records"    element={<DashboardRoute roles={["patient"]}><MedicalRecords /></DashboardRoute>} />
        <Route path="/book-appointment/:doctorId" element={<DashboardRoute roles={["patient"]}><BookAppointment /></DashboardRoute>} />

        {/* ── Doctor dashboard ── */}
        <Route path="/doctor/dashboard"    element={<DashboardRoute roles={["doctor"]}><DoctorDashboard /></DashboardRoute>} />
        <Route path="/doctor/appointments" element={<DashboardRoute roles={["doctor"]}><DoctorAppointments /></DashboardRoute>} />
        <Route path="/doctor/profile"      element={<DashboardRoute roles={["doctor"]}><DoctorProfile /></DashboardRoute>} />

        {/* ── Admin dashboard ── */}
        <Route path="/admin/dashboard"    element={<DashboardRoute roles={["admin"]}><AdminDashboard /></DashboardRoute>} />
        <Route path="/admin/doctors"      element={<DashboardRoute roles={["admin"]}><AdminDoctors /></DashboardRoute>} />
        <Route path="/admin/users"        element={<DashboardRoute roles={["admin"]}><AdminUsers /></DashboardRoute>} />
        <Route path="/admin/appointments" element={<DashboardRoute roles={["admin"]}><AdminAppointments /></DashboardRoute>} />

        {/* ── Shared dashboard pages ── */}
        <Route path="/messages" element={<DashboardRoute><Messages /></DashboardRoute>} />
        <Route path="/profile"  element={<DashboardRoute><Profile /></DashboardRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnHover theme="colored" />
    </Router>
  );
}

// Helper — wraps page with footer
function WithFooter({ children }) {
  return (
    <>
      <main style={{ minHeight:"calc(100vh - 68px)" }}>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
