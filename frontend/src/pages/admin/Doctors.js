import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaUserMd } from "react-icons/fa";
import api from "../../utils/api";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, approved, pending

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users?role=doctor");
      // Get doctor profiles
      const { data: d2 } = await api.get("/doctors?limit=100");
      setDoctors(d2.doctors || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const approveDoctor = async (doctorId, approve) => {
    try {
      await api.put(`/admin/doctors/${doctorId}/approve`, { isApproved: approve });
      toast.success(approve ? "Doctor approved!" : "Doctor rejected");
      fetchDoctors();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const filtered = filter === "approved" ? doctors.filter(d => d.isApproved) : filter === "pending" ? doctors.filter(d => !d.isApproved) : doctors;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Manage Doctors</h1>
          <p>Approve and manage doctor registrations</p>
        </div>
      </div>
      <div className="container" style={{ paddingBottom: "3rem" }}>
        <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.5rem", background: "white", padding: "0.375rem", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow)", width: "fit-content" }}>
          {["all", "approved", "pending"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.875rem", background: filter === f ? "var(--sky-500)" : "transparent", color: filter === f ? "white" : "var(--gray-600)", border: "none", cursor: "pointer", textTransform: "capitalize" }}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}><div className="loader" style={{ width: 40, height: 40, borderWidth: 4 }} /></div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.map((doc) => (
              <div key={doc._id} className="card" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "1rem", flex: "1 1 280px", alignItems: "center" }}>
                  <div style={{ width: 52, height: 52, background: "linear-gradient(135deg, var(--sky-400), var(--sky-600))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "1.25rem" }}>
                    {doc.user?.name?.[0] || "D"}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700 }}>Dr. {doc.user?.name}</p>
                    <p style={{ fontSize: "0.8125rem", color: "var(--sky-600)", fontWeight: 600 }}>{doc.specialization}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>{doc.user?.email}</p>
                  </div>
                </div>
                <div style={{ flex: "1 1 160px" }}>
                  <p style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>Experience</p>
                  <p style={{ fontWeight: 600 }}>{doc.experience} years</p>
                </div>
                <div style={{ flex: "1 1 120px" }}>
                  <p style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>Fee</p>
                  <p style={{ fontWeight: 600, color: "var(--sky-700)" }}>₹{doc.consultationFee}</p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ padding: "0.25rem 0.75rem", borderRadius: "var(--radius-full)", fontSize: "0.8rem", fontWeight: 700, background: doc.isApproved ? "#dcfce7" : "#fef9c3", color: doc.isApproved ? "#166534" : "#92400e" }}>
                    {doc.isApproved ? "Approved" : "Pending"}
                  </span>
                  {!doc.isApproved ? (
                    <button className="btn btn-success btn-sm" onClick={() => approveDoctor(doc._id, true)}>
                      <FaCheck /> Approve
                    </button>
                  ) : (
                    <button className="btn btn-danger btn-sm" onClick={() => approveDoctor(doc._id, false)}>
                      <FaTimes /> Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ textAlign: "center", padding: "4rem", color: "var(--gray-400)" }}><FaUserMd style={{ fontSize: "3rem", marginBottom: "1rem" }} /><p>No doctors found</p></div>}
          </div>
        )}
      </div>
    </div>
  );
}
