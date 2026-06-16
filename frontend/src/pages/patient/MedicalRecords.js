import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaFolderOpen, FaPlus, FaTrash, FaTimes, FaFileMedical } from "react-icons/fa";
import api from "../../utils/api";

const RECORD_TYPES = ["prescription", "lab-report", "scan", "discharge-summary", "other"];
const typeColors = {
  prescription: { bg: "#dcfce7", color: "#166534" },
  "lab-report": { bg: "var(--sky-100)", color: "var(--sky-800)" },
  scan: { bg: "#ede9fe", color: "#5b21b6" },
  "discharge-summary": { bg: "#fef9c3", color: "#92400e" },
  other: { bg: "var(--gray-100)", color: "var(--gray-700)" },
};

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", recordType: "other", fileUrl: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/patients/records");
      setRecords(data.records || []);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/patients/records", form);
      toast.success("Record added!");
      setShowForm(false);
      setForm({ title: "", description: "", recordType: "other", fileUrl: "" });
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add record");
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await api.delete(`/patients/records/${id}`);
      toast.success("Record deleted");
      fetchRecords();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container"><h1>Medical Records</h1><p>Manage your health documents and reports</p></div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <FaPlus /> Add Record
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}><div className="loader" style={{ width: 40, height: 40, borderWidth: 4 }} /></div>
        ) : records.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--gray-400)" }}>
            <FaFolderOpen style={{ fontSize: "3rem", marginBottom: "1rem" }} />
            <h3 style={{ color: "var(--gray-500)" }}>No medical records yet</h3>
            <p>Add prescriptions, reports, and other medical documents</p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)} style={{ marginTop: "1rem" }}><FaPlus /> Add First Record</button>
          </div>
        ) : (
          <div className="grid-3">
            {records.map((record) => {
              const tc = typeColors[record.recordType] || typeColors.other;
              return (
                <div key={record._id} className="card" style={{ transition: "transform 0.2s", cursor: "default" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem" }}>
                    <div style={{ width: 44, height: 44, background: tc.bg, borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", color: tc.color }}>
                      <FaFileMedical />
                    </div>
                    <button onClick={() => deleteRecord(record._id)} style={{ background: "none", border: "none", color: "var(--gray-300)", cursor: "pointer", fontSize: "0.875rem", padding: "0.25rem", transition: "color 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "var(--red-500)"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--gray-300)"}>
                      <FaTrash />
                    </button>
                  </div>
                  <h4 style={{ fontWeight: 700, color: "var(--gray-900)", marginBottom: "0.375rem", fontSize: "0.9375rem" }}>{record.title}</h4>
                  <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700, background: tc.bg, color: tc.color, marginBottom: "0.5rem", textTransform: "capitalize" }}>
                    {record.recordType.replace("-", " ")}
                  </span>
                  {record.description && <p style={{ fontSize: "0.8125rem", color: "var(--gray-500)", lineHeight: 1.5 }}>{record.description}</p>}
                  {record.fileUrl && (
                    <a href={record.fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: "0.75rem", display: "inline-flex" }}>View File</a>
                  )}
                  <p style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: "0.625rem" }}>
                    {new Date(record.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Add record modal */}
        {showForm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
            <div className="card" style={{ maxWidth: 480, width: "100%", animation: "fadeIn 0.2s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h3 style={{ fontWeight: 700 }}>Add Medical Record</h3>
                <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", color: "var(--gray-400)" }}><FaTimes /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input type="text" className="form-input" placeholder="e.g., Blood Test Report - Jan 2024"
                    value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Record Type</label>
                  <select className="form-input form-select" value={form.recordType} onChange={(e) => setForm({ ...form, recordType: e.target.value })}>
                    {RECORD_TYPES.map(t => <option key={t} value={t}>{t.replace("-", " ")}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} placeholder="Add notes about this record..."
                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
                </div>
                <div className="form-group">
                  <label className="form-label">File URL (optional)</label>
                  <input type="url" className="form-input" placeholder="https://drive.google.com/..."
                    value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button type="button" className="btn btn-outline w-full" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                    {saving ? <><span className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} /> Adding...</> : "Add Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
