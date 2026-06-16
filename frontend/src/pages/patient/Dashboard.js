import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaUserMd, FaFlask, FaFolderOpen, FaVideo, FaArrowRight, FaClock, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/appointments/my?limit=5")
      .then(({ data }) => setAppointments(data.appointments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter(a => ["pending", "confirmed"].includes(a.status));
  const completed = appointments.filter(a => a.status === "completed").length;

  const quickLinks = [
    { icon: <FaUserMd />, label: "Find Doctor", to: "/doctors", color: "var(--sky-500)", bg: "var(--sky-50)" },
    { icon: <FaCalendarAlt />, label: "My Appointments", to: "/my-appointments", color: "#8b5cf6", bg: "#ede9fe" },
    { icon: <FaFlask />, label: "Symptom Checker", to: "/symptom-checker", color: "#f59e0b", bg: "#fffbeb" },
    { icon: <FaFolderOpen />, label: "Medical Records", to: "/medical-records", color: "#22c55e", bg: "#dcfce7" },
  ];

  const statusConfig = {
    pending: { color: "#f59e0b", bg: "#fef9c3", label: "Pending" },
    confirmed: { color: "var(--sky-600)", bg: "var(--sky-100)", label: "Confirmed" },
    completed: { color: "#22c55e", bg: "#dcfce7", label: "Completed" },
    cancelled: { color: "#ef4444", bg: "#fee2e2", label: "Cancelled" },
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Welcome, {user?.name?.split(" ")[0]}! 👋</h1>
          <p>Manage your health appointments and records</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: "2rem" }}>
          {[
            { label: "Upcoming", value: upcoming.length, icon: <FaClock />, color: "var(--sky-500)", bg: "var(--sky-50)" },
            { label: "Completed", value: completed, icon: <FaCheckCircle />, color: "#22c55e", bg: "#dcfce7" },
            { label: "Total Appointments", value: appointments.length, icon: <FaCalendarAlt />, color: "#8b5cf6", bg: "#ede9fe" },
            { label: "Video Consults", value: appointments.filter(a => a.type === "telemedicine").length, icon: <FaVideo />, color: "#f59e0b", bg: "#fffbeb" },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 52, height: 52, background: bg, borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", color, flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--gray-900)", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: "0.8125rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: "2rem", alignItems: "start" }}>
          {/* Quick Links */}
          <div>
            <h2 style={{ fontWeight: 700, marginBottom: "1.25rem", color: "var(--gray-800)" }}>Quick Actions</h2>
            <div className="grid-2" style={{ gap: "1rem" }}>
              {quickLinks.map(({ icon, label, to, color, bg }) => (
                <Link key={label} to={to} className="card" style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "1.125rem", textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}>
                  <div style={{ width: 44, height: 44, background: bg, borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.125rem", color, flexShrink: 0 }}>
                    {icon}
                  </div>
                  <span style={{ fontWeight: 600, color: "var(--gray-700)", fontSize: "0.9rem" }}>{label}</span>
                  <FaArrowRight style={{ marginLeft: "auto", color: "var(--gray-300)", fontSize: "0.75rem" }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent appointments */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontWeight: 700, color: "var(--gray-800)" }}>Recent Appointments</h2>
              <Link to="/my-appointments" style={{ fontSize: "0.8125rem", color: "var(--sky-600)", fontWeight: 600 }}>View all →</Link>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}><div className="loader" /></div>
            ) : appointments.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "2.5rem", color: "var(--gray-400)" }}>
                <FaCalendarAlt style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }} />
                <p>No appointments yet</p>
                <Link to="/doctors" className="btn btn-primary btn-sm" style={{ marginTop: "0.75rem" }}>Book Now</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {appointments.slice(0, 4).map((appt) => {
                  const status = statusConfig[appt.status] || statusConfig.pending;
                  return (
                    <div key={appt._id} className="card" style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                          <div style={{ width: 40, height: 40, background: "var(--sky-100)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sky-600)", fontWeight: 700 }}>
                            {appt.doctor?.user?.name?.[0] || "D"}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--gray-800)" }}>Dr. {appt.doctor?.user?.name || "Doctor"}</p>
                            <p style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>
                              {new Date(appt.appointmentDate).toLocaleDateString("en-IN")} • {appt.timeSlot}
                            </p>
                          </div>
                        </div>
                        <span className="badge" style={{ background: status.bg, color: status.color }}>{status.label}</span>
                      </div>
                      {appt.type === "telemedicine" && appt.meetingLink && appt.status === "confirmed" && (
                        <a href={appt.meetingLink} target="_blank" rel="noreferrer"
                          className="btn btn-sm" style={{ marginTop: "0.625rem", background: "#ede9fe", color: "#6d28d9", width: "fit-content" }}>
                          <FaVideo /> Join Video Call
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
