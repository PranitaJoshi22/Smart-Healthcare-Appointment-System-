import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaUsers, FaUserMd, FaCalendarAlt, FaMoneyBillWave, FaCheckCircle, FaClock, FaTimesCircle, FaUserClock } from "react-icons/fa";
import api from "../../utils/api";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: "4rem" }}><div className="loader" style={{ width: 40, height: 40, borderWidth: 4 }} /></div>;
  if (!stats) return <div style={{ padding: "2rem", textAlign: "center", color: "var(--red-500)" }}>Failed to load dashboard data</div>;

  const chartData = stats.monthlyData?.map(d => ({
    month: MONTHS[d._id.month - 1],
    appointments: d.count,
  })) || [];

  const statCards = [
    { label: "Total Patients", value: stats.totalPatients, icon: <FaUsers />, color: "var(--sky-600)", bg: "var(--sky-50)", link: "/admin/users?role=patient" },
    { label: "Active Doctors", value: stats.totalDoctors, icon: <FaUserMd />, color: "#22c55e", bg: "#dcfce7", link: "/admin/doctors" },
    { label: "Pending Doctors", value: stats.pendingDoctors, icon: <FaUserClock />, color: "#f59e0b", bg: "#fef9c3", link: "/admin/doctors?pending=true" },
    { label: "Total Appointments", value: stats.totalAppointments, icon: <FaCalendarAlt />, color: "#8b5cf6", bg: "#ede9fe", link: "/admin/appointments" },
    { label: "Today's Appointments", value: stats.todayAppointments, icon: <FaClock />, color: "var(--sky-500)", bg: "var(--sky-50)", link: "/admin/appointments" },
    { label: "Completed", value: stats.completedAppointments, icon: <FaCheckCircle />, color: "#22c55e", bg: "#dcfce7", link: "/admin/appointments?status=completed" },
    { label: "Cancelled", value: stats.cancelledAppointments, icon: <FaTimesCircle />, color: "#ef4444", bg: "#fee2e2", link: "/admin/appointments?status=cancelled" },
    { label: "Total Revenue", value: `₹${(stats.revenue || 0).toLocaleString("en-IN")}`, icon: <FaMoneyBillWave />, color: "#22c55e", bg: "#dcfce7", link: "#" },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>System overview and analytics</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {statCards.map(({ label, value, icon, color, bg, link }) => (
            <Link key={label} to={link} className="card" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", transition: "transform 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
              <div style={{ width: 50, height: 50, background: bg, borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", color, flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--gray-900)", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginTop: "0.125rem" }}>{label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="card" style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "1.5rem", color: "var(--gray-800)" }}>Monthly Appointments</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                <XAxis dataKey="month" tick={{ fill: "var(--gray-500)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--gray-500)", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "var(--radius)", border: "1px solid var(--gray-200)" }} />
                <Bar dataKey="appointments" fill="var(--sky-500)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Quick admin actions */}
        <div className="grid-3">
          {[
            { title: "Manage Doctors", desc: "Approve/reject doctor registrations", to: "/admin/doctors", color: "var(--sky-500)" },
            { title: "Manage Users", desc: "View and manage all registered users", to: "/admin/users", color: "#22c55e" },
            { title: "All Appointments", desc: "Monitor and manage all appointments", to: "/admin/appointments", color: "#8b5cf6" },
          ].map(({ title, desc, to, color }) => (
            <Link key={title} to={to} className="card" style={{ textDecoration: "none", borderLeft: `4px solid ${color}`, transition: "transform 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
              <h4 style={{ fontWeight: 700, color: "var(--gray-800)", marginBottom: "0.375rem" }}>{title}</h4>
              <p style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
