import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import api from "../../utils/api";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => { fetchAppointments(); }, [statusFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const q = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const { data } = await api.get(`/admin/appointments${q}`);
      setAppointments(data.appointments || []);
    } finally { setLoading(false); }
  };

  const statusColors = {
    pending: { bg: "#fef9c3", color: "#92400e" },
    confirmed: { bg: "var(--sky-100)", color: "var(--sky-800)" },
    completed: { bg: "#dcfce7", color: "#166534" },
    cancelled: { bg: "#fee2e2", color: "#991b1b" },
  };

  return (
    <div>
      <div className="page-header">
        <div className="container"><h1>All Appointments</h1><p>Monitor all system appointments</p></div>
      </div>
      <div className="container" style={{ paddingBottom: "3rem" }}>
        <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {["all", "pending", "confirmed", "completed", "cancelled"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: "0.5rem 0.875rem", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.875rem", background: statusFilter === s ? "var(--sky-500)" : "white", color: statusFilter === s ? "white" : "var(--gray-600)", border: `1.5px solid ${statusFilter === s ? "var(--sky-500)" : "var(--gray-200)"}`, cursor: "pointer", textTransform: "capitalize" }}>
              {s}
            </button>
          ))}
        </div>

        {loading ? <div style={{ textAlign: "center", padding: "4rem" }}><div className="loader" style={{ width: 40, height: 40, borderWidth: 4 }} /></div> : (
          <div style={{ background: "white", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow)", overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: "var(--sky-50)", borderBottom: "1px solid var(--gray-200)" }}>
                  {["Patient", "Doctor", "Date & Time", "Type", "Amount", "Status"].map(h => (
                    <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.8125rem", fontWeight: 700, color: "var(--gray-600)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => {
                  const sc = statusColors[appt.status] || statusColors.pending;
                  return (
                    <tr key={appt._id} style={{ borderBottom: "1px solid var(--gray-100)" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--sky-50)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
                      <td style={{ padding: "0.875rem 1rem", fontWeight: 600, fontSize: "0.875rem" }}>{appt.patient?.name || "—"}</td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--gray-600)" }}>Dr. {appt.doctor?.user?.name || "—"}</td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem" }}>
                        <p>{new Date(appt.appointmentDate).toLocaleDateString("en-IN")}</p>
                        <p style={{ color: "var(--gray-500)" }}>{appt.timeSlot}</p>
                      </td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", textTransform: "capitalize" }}>{appt.type}</td>
                      <td style={{ padding: "0.875rem 1rem", fontWeight: 700, color: "var(--sky-700)" }}>₹{appt.amount}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span style={{ padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700, background: sc.bg, color: sc.color, textTransform: "capitalize" }}>{appt.status}</span>
                      </td>
                    </tr>
                  );
                })}
                {appointments.length === 0 && <tr><td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "var(--gray-400)" }}><FaCalendarAlt style={{ fontSize: "2rem", marginBottom: "0.5rem" }} /><br />No appointments found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
