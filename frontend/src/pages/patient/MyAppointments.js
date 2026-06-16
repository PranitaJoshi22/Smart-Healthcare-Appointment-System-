import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaVideo, FaStar, FaTimes } from "react-icons/fa";
import api from "../../utils/api";

const STATUS_TABS = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showReview, setShowReview] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    fetchAppointments();
  }, [activeTab]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const q = activeTab !== "all" ? `?status=${activeTab}` : "";
      const { data } = await api.get(`/appointments/my${q}`);
      setAppointments(data.appointments || []);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await api.put(`/appointments/${id}/cancel`, { reason: "Patient cancelled" });
      toast.success("Appointment cancelled");
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  const submitReview = async () => {
    if (!showReview) return;
    try {
      await api.post("/reviews", {
        doctorId: showReview.doctor._id,
        appointmentId: showReview._id,
        ...reviewData,
      });
      toast.success("Review submitted!");
      setShowReview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  const statusBadge = {
    pending: { bg: "#fef9c3", color: "#92400e", label: "Pending" },
    confirmed: { bg: "var(--sky-100)", color: "var(--sky-800)", label: "Confirmed" },
    completed: { bg: "#dcfce7", color: "#166534", label: "Completed" },
    cancelled: { bg: "#fee2e2", color: "#991b1b", label: "Cancelled" },
    "no-show": { bg: "#f3f4f6", color: "#374151", label: "No Show" },
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>My Appointments</h1>
          <p>Track and manage all your appointments</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.5rem", background: "white", padding: "0.375rem", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow)", width: "fit-content", flexWrap: "wrap" }}>
          {STATUS_TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.875rem", background: activeTab === tab ? "var(--sky-500)" : "transparent", color: activeTab === tab ? "white" : "var(--gray-600)", border: "none", cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s" }}>
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}><div className="loader" style={{ width: 40, height: 40, borderWidth: 4 }} /></div>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--gray-400)" }}>
            <FaCalendarAlt style={{ fontSize: "3rem", marginBottom: "1rem" }} />
            <h3 style={{ color: "var(--gray-500)" }}>No {activeTab !== "all" ? activeTab : ""} appointments</h3>
            <Link to="/doctors" className="btn btn-primary btn-sm" style={{ marginTop: "1rem" }}>Book Appointment</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {appointments.map((appt) => {
              const s = statusBadge[appt.status] || statusBadge.pending;
              return (
                <div key={appt._id} className="card" style={{ animation: "fadeIn 0.3s ease" }}>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {/* Doctor info */}
                    <div style={{ display: "flex", gap: "0.875rem", flex: "1 1 280px", alignItems: "center" }}>
                      <div style={{ width: 56, height: 56, background: "var(--sky-100)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", color: "var(--sky-600)", fontWeight: 700, flexShrink: 0 }}>
                        {appt.doctor?.user?.name?.[0] || "D"}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: "var(--gray-900)" }}>Dr. {appt.doctor?.user?.name || "Doctor"}</p>
                        <p style={{ fontSize: "0.8125rem", color: "var(--sky-600)", fontWeight: 600 }}>{appt.doctor?.specialization}</p>
                        {appt.isEmergency && <span style={{ fontSize: "0.75rem", background: "#fee2e2", color: "#dc2626", padding: "0.1rem 0.4rem", borderRadius: "var(--radius-full)", fontWeight: 700 }}>🚨 Emergency</span>}
                      </div>
                    </div>

                    {/* Date/time */}
                    <div style={{ flex: "1 1 160px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>Date & Time</p>
                      <p style={{ fontWeight: 600, color: "var(--gray-800)" }}>{new Date(appt.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      <p style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>{appt.timeSlot}</p>
                    </div>

                    {/* Type */}
                    <div style={{ flex: "1 1 120px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>Type</p>
                      <p style={{ fontWeight: 600, color: "var(--gray-700)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                        {appt.type === "telemedicine" ? <><FaVideo style={{ color: "#8b5cf6" }} /> Video</> : "In-Person"}
                      </p>
                      <p style={{ fontSize: "0.8125rem", color: "var(--sky-700)", fontWeight: 700 }}>₹{appt.amount}</p>
                    </div>

                    {/* Status */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end", justifyContent: "center" }}>
                      <span style={{ padding: "0.25rem 0.75rem", borderRadius: "var(--radius-full)", fontSize: "0.8rem", fontWeight: 700, background: s.bg, color: s.color }}>{s.label}</span>

                      {appt.type === "telemedicine" && appt.meetingLink && appt.status === "confirmed" && (
                        <a href={appt.meetingLink} target="_blank" rel="noreferrer"
                          className="btn btn-sm" style={{ background: "#ede9fe", color: "#6d28d9" }}>
                          <FaVideo /> Join Call
                        </a>
                      )}
                      {["pending", "confirmed"].includes(appt.status) && (
                        <button className="btn btn-sm btn-danger" onClick={() => cancelAppointment(appt._id)}>
                          <FaTimes /> Cancel
                        </button>
                      )}
                      {appt.status === "completed" && (
                        <button className="btn btn-sm" onClick={() => setShowReview(appt)}
                          style={{ background: "#fef9c3", color: "#92400e" }}>
                          <FaStar /> Review
                        </button>
                      )}
                    </div>
                  </div>

                  {appt.prescription && (
                    <div style={{ marginTop: "0.875rem", padding: "0.75rem", background: "#dcfce7", borderRadius: "var(--radius)", borderLeft: "4px solid #22c55e" }}>
                      <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#166534", marginBottom: "0.25rem" }}>Prescription</p>
                      <p style={{ fontSize: "0.8125rem", color: "#166534" }}>{appt.prescription}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Review modal */}
        {showReview && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
            <div className="card" style={{ maxWidth: 440, width: "100%", animation: "fadeIn 0.2s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <h3 style={{ fontWeight: 700 }}>Rate Dr. {showReview.doctor?.user?.name}</h3>
                <button onClick={() => setShowReview(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", fontSize: "1.25rem" }}><FaTimes /></button>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} onClick={() => setReviewData({ ...reviewData, rating: star })}
                    style={{ fontSize: "1.75rem", cursor: "pointer", color: star <= reviewData.rating ? "#fbbf24" : "var(--gray-200)", transition: "color 0.15s" }} />
                ))}
              </div>
              <textarea className="form-input" rows={4} placeholder="Share your experience (optional)..."
                value={reviewData.comment} onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                style={{ marginBottom: "1rem", resize: "vertical" }} />
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button className="btn btn-outline w-full" onClick={() => setShowReview(null)}>Cancel</button>
                <button className="btn btn-primary w-full" onClick={submitReview}>Submit Review</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
