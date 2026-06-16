import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaVideo, FaCheck, FaTimes } from "react-icons/fa";
import api from "../../utils/api";

const STATUS_TABS = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [prescription, setPrescription] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, [activeTab, selectedDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let q = "?";
      if (activeTab !== "all") q += `status=${activeTab}&`;
      if (selectedDate) q += `date=${selectedDate}`;
      const { data } = await api.get(`/appointments/doctor${q}`);
      setAppointments(data.appointments || []);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status, prescription: prescription || undefined });
      toast.success(`Appointment ${status}`);
      setSelectedAppt(null);
      setPrescription("");
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const statusBadge = {
    pending: { bg: "#fef9c3", color: "#92400e" },
    confirmed: { bg: "var(--sky-100)", color: "var(--sky-800)" },
    completed: { bg: "#dcfce7", color: "#166534" },
    cancelled: { bg: "#fee2e2", color: "#991b1b" },
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>My Appointments</h1>
          <p>Manage your patient appointments</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.5rem", background: "white", padding: "1rem", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow)" }}>
          <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
            {STATUS_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.875rem", background: activeTab === tab ? "var(--sky-500)" : "transparent", color: activeTab === tab ? "white" : "var(--gray-600)", border: "none", cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s" }}>
                {tab}
              </button>
            ))}
          </div>
          <input type="date" className="form-input" style={{ width: "auto" }} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}><div className="loader" style={{ width: 40, height: 40, borderWidth: 4 }} /></div>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--gray-400)" }}>
            <FaCalendarAlt style={{ fontSize: "3rem", marginBottom: "1rem" }} />
            <p>No appointments found</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {appointments.map((appt) => {
              const s = statusBadge[appt.status] || statusBadge.pending;
              return (
                <div key={appt._id} className="card">
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "0.875rem", flex: "1 1 240px", alignItems: "center" }}>
                      <div style={{ width: 52, height: 52, background: "var(--sky-100)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sky-700)", fontWeight: 700, fontSize: "1.125rem" }}>
                        {appt.patient?.name?.[0] || "P"}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: "var(--gray-900)" }}>{appt.patient?.name || "Patient"}</p>
                        <p style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>{appt.patient?.email}</p>
                        <p style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>{appt.patient?.phone}</p>
                      </div>
                    </div>

                    <div style={{ flex: "1 1 160px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>Date & Time</p>
                      <p style={{ fontWeight: 600 }}>{new Date(appt.appointmentDate).toLocaleDateString("en-IN")}</p>
                      <p style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>{appt.timeSlot}</p>
                    </div>

                    <div style={{ flex: "1 1 120px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>Type</p>
                      <p style={{ fontWeight: 600, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        {appt.type === "telemedicine" ? <><FaVideo style={{ color: "#8b5cf6" }} /> Video</> : "In-Person"}
                      </p>
                      {appt.isEmergency && <span style={{ fontSize: "0.7rem", background: "#fee2e2", color: "#dc2626", padding: "0.1rem 0.4rem", borderRadius: "var(--radius-full)", fontWeight: 700 }}>🚨 Emergency</span>}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ padding: "0.25rem 0.625rem", borderRadius: "var(--radius-full)", fontSize: "0.8rem", fontWeight: 700, background: s.bg, color: s.color, textTransform: "capitalize" }}>{appt.status}</span>

                      {appt.status === "pending" && (
                        <button className="btn btn-success btn-sm" onClick={() => updateStatus(appt._id, "confirmed")}>
                          <FaCheck /> Confirm
                        </button>
                      )}
                      {appt.status === "confirmed" && (
                        <button className="btn btn-primary btn-sm" onClick={() => { setSelectedAppt(appt); setPrescription(""); }}>
                          Complete
                        </button>
                      )}
                      {["pending", "confirmed"].includes(appt.status) && (
                        <button className="btn btn-danger btn-sm" onClick={() => updateStatus(appt._id, "cancelled")}>
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </div>

                  {appt.symptoms && (
                    <div style={{ marginTop: "0.75rem", padding: "0.625rem 0.875rem", background: "var(--sky-50)", borderRadius: "var(--radius)", fontSize: "0.8125rem", color: "var(--gray-600)", borderLeft: "3px solid var(--sky-400)" }}>
                      <strong>Symptoms:</strong> {appt.symptoms}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Complete appointment modal */}
        {selectedAppt && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
            <div className="card" style={{ maxWidth: 480, width: "100%", animation: "fadeIn 0.2s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <h3 style={{ fontWeight: 700 }}>Complete Appointment</h3>
                <button onClick={() => setSelectedAppt(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", color: "var(--gray-400)" }}><FaTimes /></button>
              </div>
              <p style={{ color: "var(--gray-600)", marginBottom: "1rem", fontSize: "0.875rem" }}>Patient: <strong>{selectedAppt.patient?.name}</strong></p>
              <div className="form-group">
                <label className="form-label">Prescription / Notes</label>
                <textarea className="form-input" rows={4} placeholder="Enter prescription and treatment notes..."
                  value={prescription} onChange={(e) => setPrescription(e.target.value)} style={{ resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button className="btn btn-outline w-full" onClick={() => setSelectedAppt(null)}>Cancel</button>
                <button className="btn btn-success w-full" onClick={() => updateStatus(selectedAppt._id, "completed")}>
                  <FaCheck /> Mark Completed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
