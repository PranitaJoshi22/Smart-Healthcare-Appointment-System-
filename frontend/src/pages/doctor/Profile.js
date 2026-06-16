import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaSave, FaPlus, FaTimes } from "react-icons/fa";
import api from "../../utils/api";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const SPECIALIZATIONS = ["General Physician","Cardiologist","Neurologist","Orthopedist","Dermatologist","Pediatrician","Gynecologist","ENT","Ophthalmologist","Psychiatrist","Oncologist","Gastroenterologist","Pulmonologist","Endocrinologist","Rheumatologist","Urologist","Allergist","Radiologist","Anesthesiologist","Pathologist"];

export default function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    specialization: "", experience: 0, consultationFee: 500, hospital: "",
    bio: "", languages: [], qualification: [], availableSlots: [], telemedicineEnabled: true,
  });
  const [newQual, setNewQual] = useState("");
  const [newLang, setNewLang] = useState("");

  useEffect(() => {
    api.get("/doctors/my-profile").then(({ data }) => {
      setProfile(data.doctor);
      const d = data.doctor;
      setForm({
        specialization: d.specialization || "",
        experience: d.experience || 0,
        consultationFee: d.consultationFee || 500,
        hospital: d.hospital || "",
        bio: d.bio || "",
        languages: d.languages || [],
        qualification: d.qualification || [],
        availableSlots: d.availableSlots || [],
        telemedicineEnabled: d.telemedicineEnabled ?? true,
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const addSlot = () => {
    setForm({ ...form, availableSlots: [...form.availableSlots, { day: "Monday", startTime: "09:00", endTime: "17:00", slotDuration: 30 }] });
  };

  const updateSlot = (idx, field, value) => {
    const slots = [...form.availableSlots];
    slots[idx] = { ...slots[idx], [field]: value };
    setForm({ ...form, availableSlots: slots });
  };

  const removeSlot = (idx) => setForm({ ...form, availableSlots: form.availableSlots.filter((_, i) => i !== idx) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/doctors/update", form);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "4rem" }}><div className="loader" style={{ width: 40, height: 40, borderWidth: 4 }} /></div>;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>My Profile</h1>
          <p>Update your professional information and availability</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem", maxWidth: 800 }}>
        <form onSubmit={handleSubmit}>
          {/* Basic info */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "1.25rem", color: "var(--gray-800)" }}>Professional Information</h3>
            <div className="grid-2" style={{ gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <select name="specialization" className="form-input form-select" value={form.specialization} onChange={handleChange}>
                  {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience (years)</label>
                <input type="number" name="experience" className="form-input" value={form.experience} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Fee (₹)</label>
                <input type="number" name="consultationFee" className="form-input" value={form.consultationFee} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Hospital / Clinic</label>
                <input type="text" name="hospital" className="form-input" value={form.hospital} onChange={handleChange} placeholder="City Hospital" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea name="bio" className="form-input" rows={4} value={form.bio} onChange={handleChange} placeholder="Tell patients about yourself..." style={{ resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <input type="checkbox" id="telemedicine" name="telemedicineEnabled" checked={form.telemedicineEnabled} onChange={handleChange}
                style={{ width: 18, height: 18, accentColor: "var(--sky-500)", cursor: "pointer" }} />
              <label htmlFor="telemedicine" style={{ fontWeight: 600, color: "var(--gray-700)", cursor: "pointer" }}>Enable Video Consultation</label>
            </div>
          </div>

          {/* Qualifications */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "1.25rem", color: "var(--gray-800)" }}>Qualifications</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {form.qualification.map((q, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "var(--sky-100)", color: "var(--sky-700)", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)", fontSize: "0.875rem", fontWeight: 600 }}>
                  {q} <FaTimes style={{ cursor: "pointer", fontSize: "0.7rem" }} onClick={() => setForm({ ...form, qualification: form.qualification.filter((_, j) => j !== i) })} />
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input type="text" className="form-input" placeholder="e.g., MBBS, MD Cardiology" value={newQual} onChange={(e) => setNewQual(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), newQual.trim() && setForm({ ...form, qualification: [...form.qualification, newQual.trim()] }) && setNewQual(""))} />
              <button type="button" className="btn btn-primary" onClick={() => { if (newQual.trim()) { setForm({ ...form, qualification: [...form.qualification, newQual.trim()] }); setNewQual(""); } }}>
                <FaPlus />
              </button>
            </div>
          </div>

          {/* Available slots */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontWeight: 700, color: "var(--gray-800)" }}>Availability</h3>
              <button type="button" className="btn btn-primary btn-sm" onClick={addSlot}><FaPlus /> Add Day</button>
            </div>
            {form.availableSlots.length === 0 ? (
              <p style={{ color: "var(--gray-400)", fontSize: "0.875rem" }}>No availability slots added. Click "Add Day" to add your schedule.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {form.availableSlots.map((slot, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", padding: "0.75rem", background: "var(--sky-50)", borderRadius: "var(--radius)" }}>
                    <select className="form-input form-select" style={{ flex: "1 1 120px" }} value={slot.day} onChange={(e) => updateSlot(i, "day", e.target.value)}>
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input type="time" className="form-input" style={{ flex: "1 1 100px" }} value={slot.startTime} onChange={(e) => updateSlot(i, "startTime", e.target.value)} />
                    <span style={{ color: "var(--gray-400)", fontSize: "0.875rem" }}>to</span>
                    <input type="time" className="form-input" style={{ flex: "1 1 100px" }} value={slot.endTime} onChange={(e) => updateSlot(i, "endTime", e.target.value)} />
                    <select className="form-input form-select" style={{ flex: "1 1 120px" }} value={slot.slotDuration} onChange={(e) => updateSlot(i, "slotDuration", Number(e.target.value))}>
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>60 min</option>
                    </select>
                    <button type="button" onClick={() => removeSlot(i)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "var(--radius)", padding: "0.5rem", cursor: "pointer" }}>
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? <><span className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</> : <><FaSave /> Save Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
}
