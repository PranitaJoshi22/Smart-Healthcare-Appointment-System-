import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaUserInjured, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    // Fetch today's appointments for schedule
    const fetchToday = api.get(`/appointments/doctor?date=${today}`)
      .then(({ data }) => setTodayAppointments(data.appointments || []))
      .catch(() => setTodayAppointments([]));

    // Fetch ALL appointments for counts
    const fetchAll = api.get(`/appointments/doctor?limit=1000`)
      .then(({ data }) => setAllAppointments(data.appointments || []))
      .catch(() => setAllAppointments([]));

    Promise.all([fetchToday, fetchAll]).finally(() => setLoading(false));
  }, []);

  // Count from ALL appointments
  const totalPending   = allAppointments.filter(a => a.status === "pending").length;
  const totalConfirmed = allAppointments.filter(a => a.status === "confirmed").length;
  const totalCompleted = allAppointments.filter(a => a.status === "completed").length;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Doctor Dashboard</h1>
          <p>Welcome, Dr. {user?.name?.split(" ")[0]}! Here's your overview.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>

        {/* Stats — all-time counts */}
        <div className="grid-4" style={{ marginBottom: "2rem" }}>
          {[
            { label: "Total Appointments", value: allAppointments.length,  icon: <FaCalendarAlt />, color: "var(--sky-600)", bg: "var(--sky-50)" },
            { label: "Pending",            value: totalPending,             icon: <FaClock />,       color: "#f59e0b",        bg: "#fffbeb"        },
            { label: "Confirmed",          value: totalConfirmed,           icon: <FaCheckCircle />, color: "#8b5cf6",        bg: "#ede9fe"        },
            { label: "Completed",          value: totalCompleted,           icon: <FaUserInjured />, color: "#22c55e",        bg: "#dcfce7"        },
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

        <div className="grid-2" style={{ gap: "2rem" }}>

          {/* Today's schedule */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontWeight: 700, color: "var(--gray-800)" }}>
                Today's Schedule
                <span style={{ marginLeft: "0.5rem", fontSize: "0.875rem", background: "var(--sky-100)", color: "var(--sky-700)", padding: "0.15rem 0.6rem", borderRadius: "var(--radius-full)", fontWeight: 600 }}>
                  {todayAppointments.length}
                </span>
              </h2>
              <Link to="/doctor/appointments" style={{ fontSize: "0.8125rem", color: "var(--sky-600)", fontWeight: 600 }}>
                View all →
              </Link>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}><div className="loader" /></div>
            ) : todayAppointments.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "2.5rem", color: "var(--gray-400)" }}>
                <FaCalendarAlt style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }} />
                <p style={{ fontWeight: 600, color: "var(--gray-500)" }}>No appointments today</p>
                <p style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>You have {allAppointments.length} total appointment{allAppointments.length !== 1 ? "s" : ""}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {todayAppointments.map((appt) => {
                  const statusStyle = {
                    confirmed: { bg: "var(--sky-100)", color: "var(--sky-800)" },
                    completed: { bg: "#dcfce7",        color: "#166534"        },
                    pending:   { bg: "#fef9c3",        color: "#92400e"        },
                    cancelled: { bg: "#fee2e2",        color: "#991b1b"        },
                  }[appt.status] || { bg: "#f3f4f6", color: "#374151" };

                  return (
                    <div key={appt._id} className="card" style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <div style={{ width: 40, height: 40, background: "var(--sky-100)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sky-700)", fontWeight: 700, flexShrink: 0 }}>
                          {appt.patient?.name?.[0] || "P"}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: "var(--gray-800)", fontSize: "0.9rem" }}>{appt.patient?.name || "Patient"}</p>
                          <p style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>{appt.timeSlot} · {appt.type}</p>
                        </div>
                      </div>
                      <span style={{ padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700, background: statusStyle.bg, color: statusStyle.color, textTransform: "capitalize", whiteSpace: "nowrap" }}>
                        {appt.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent all appointments */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontWeight: 700, color: "var(--gray-800)" }}>Recent Appointments</h2>
              <Link to="/doctor/appointments" style={{ fontSize: "0.8125rem", color: "var(--sky-600)", fontWeight: 600 }}>Manage →</Link>
            </div>

            {allAppointments.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "2.5rem", color: "var(--gray-400)" }}>
                <FaCalendarAlt style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }} />
                <p style={{ fontWeight: 600, color: "var(--gray-500)" }}>No appointments yet</p>
                <p style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>Patients will appear here after booking</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {allAppointments.slice(0, 5).map((appt) => {
                  const statusStyle = {
                    confirmed: { bg: "var(--sky-100)", color: "var(--sky-800)" },
                    completed: { bg: "#dcfce7",        color: "#166534"        },
                    pending:   { bg: "#fef9c3",        color: "#92400e"        },
                    cancelled: { bg: "#fee2e2",        color: "#991b1b"        },
                  }[appt.status] || { bg: "#f3f4f6", color: "#374151" };

                  return (
                    <div key={appt._id} className="card" style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <div style={{ width: 40, height: 40, background: "var(--sky-100)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sky-700)", fontWeight: 700, flexShrink: 0 }}>
                          {appt.patient?.name?.[0] || "P"}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: "var(--gray-800)", fontSize: "0.9rem" }}>{appt.patient?.name || "Patient"}</p>
                          <p style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>
                            {new Date(appt.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {appt.timeSlot}
                          </p>
                        </div>
                      </div>
                      <span style={{ padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700, background: statusStyle.bg, color: statusStyle.color, textTransform: "capitalize", whiteSpace: "nowrap" }}>
                        {appt.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick action links */}
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { label: "Manage All Appointments", to: "/doctor/appointments", desc: "Confirm, complete or cancel" },
                { label: "Update Availability",     to: "/doctor/profile",      desc: "Set schedule & slot duration" },
                { label: "Messages",                to: "/messages",            desc: "Chat with patients"           },
              ].map(({ label, to, desc }) => (
                <Link key={label} to={to} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", padding: "0.875rem 1rem", transition: "transform 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(4px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--gray-800)", fontSize: "0.875rem" }}>{label}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>{desc}</p>
                  </div>
                  <FaArrowRight style={{ color: "var(--sky-400)", flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
