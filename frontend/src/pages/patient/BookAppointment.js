import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaClock, FaVideo, FaHospital, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import api from "../../utils/api";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [form, setForm] = useState({
    appointmentDate: "",
    timeSlot: "",
    type: "in-person",
    symptoms: "",
    notes: "",
    isEmergency: false,
  });

  useEffect(() => {
    api.get(`/doctors/${doctorId}`).then(({ data }) => setDoctor(data.doctor));
  }, [doctorId]);

  useEffect(() => {
    if (form.appointmentDate) {
      setLoading(true);
      api.get(`/appointments/slots?doctorId=${doctorId}&date=${form.appointmentDate}`)
        .then(({ data }) => setSlots(data.slots || []))
        .catch(() => setSlots([]))
        .finally(() => setLoading(false));
    }
  }, [form.appointmentDate, doctorId]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value, ...(e.target.name === "appointmentDate" ? { timeSlot: "" } : {}) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.timeSlot) return toast.error("Please select a time slot");
    setBookingLoading(true);
    try {
      await api.post("/appointments/book", { doctorId, ...form });
      toast.success("Appointment booked successfully!");
      navigate("/my-appointments");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (!doctor) return <div style={{ textAlign: "center", padding: "4rem" }}><div className="loader" style={{ width: 40, height: 40, borderWidth: 4 }} /></div>;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Book Appointment</h1>
          <p>Schedule a consultation with Dr. {doctor.user?.name}</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem", maxWidth: 900 }}>
        <div className="grid-2" style={{ gap: "2rem", alignItems: "start" }}>
          {/* Doctor card */}
          <div className="card">
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                {doctor.user?.avatar ? (
                  <img src={doctor.user.avatar} alt={doctor.user.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--sky-200)" }} />
                ) : (
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--sky-400), var(--sky-600))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.75rem", fontWeight: 700 }}>
                    {doctor.user?.name?.[0]}
                  </div>
                )}
              </div>
              <div>
                <h3 style={{ fontWeight: 800, color: "var(--gray-900)" }}>Dr. {doctor.user?.name}</h3>
                <p style={{ color: "var(--sky-600)", fontWeight: 600, fontSize: "0.875rem" }}>{doctor.specialization}</p>
                <p style={{ color: "var(--gray-500)", fontSize: "0.8125rem" }}>{doctor.experience} years experience</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[
                { label: "Hospital", value: doctor.hospital || "Online" },
                { label: "Languages", value: doctor.languages?.join(", ") || "English" },
                { label: "Consultation Fee", value: `₹${doctor.consultationFee}` },
                { label: "Video Consult", value: doctor.telemedicineEnabled ? "Available" : "Not Available" },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "0.75rem", background: "var(--sky-50)", borderRadius: "var(--radius)" }}>
                  <p style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginBottom: "0.125rem" }}>{label}</p>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--gray-700)" }}>{value}</p>
                </div>
              ))}
            </div>

            {doctor.bio && (
              <div style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--gray-50)", borderRadius: "var(--radius)" }}>
                <p style={{ fontSize: "0.8125rem", color: "var(--gray-600)", lineHeight: 1.6 }}>{doctor.bio}</p>
              </div>
            )}
          </div>

          {/* Booking form */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: "1.5rem", color: "var(--gray-800)" }}>Appointment Details</h3>
            <form onSubmit={handleSubmit}>
              {/* Consultation type */}
              <div className="form-group">
                <label className="form-label">Consultation Type</label>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {[
                    { val: "in-person", label: "In-Person", icon: <FaHospital /> },
                    ...(doctor.telemedicineEnabled ? [{ val: "telemedicine", label: "Video Consult", icon: <FaVideo /> }] : []),
                  ].map(({ val, label, icon }) => (
                    <button key={val} type="button" onClick={() => setForm({ ...form, type: val })}
                      style={{ flex: 1, padding: "0.75rem", borderRadius: "var(--radius)", border: `2px solid ${form.type === val ? "var(--sky-500)" : "var(--gray-200)"}`, background: form.type === val ? "var(--sky-50)" : "white", color: form.type === val ? "var(--sky-700)" : "var(--gray-600)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="form-label"><FaCalendarAlt style={{ marginRight: "0.375rem", color: "var(--sky-400)" }} />Appointment Date</label>
                <input type="date" name="appointmentDate" className="form-input" value={form.appointmentDate}
                  onChange={handleChange} min={today} required />
              </div>

              {/* Time slots */}
              {form.appointmentDate && (
                <div className="form-group">
                  <label className="form-label"><FaClock style={{ marginRight: "0.375rem", color: "var(--sky-400)" }} />Select Time Slot</label>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "1rem" }}><div className="loader" /></div>
                  ) : slots.length === 0 ? (
                    <p style={{ color: "var(--gray-400)", fontSize: "0.875rem", padding: "0.75rem", background: "var(--gray-50)", borderRadius: "var(--radius)" }}>No slots available for this date</p>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                      {slots.map(({ time, available }) => (
                        <button key={time} type="button" disabled={!available}
                          onClick={() => setForm({ ...form, timeSlot: time })}
                          style={{ padding: "0.5rem", borderRadius: "var(--radius-sm)", border: `1.5px solid ${form.timeSlot === time ? "var(--sky-500)" : available ? "var(--gray-200)" : "var(--gray-100)"}`, background: form.timeSlot === time ? "var(--sky-500)" : available ? "white" : "var(--gray-50)", color: form.timeSlot === time ? "white" : available ? "var(--gray-700)" : "var(--gray-300)", fontSize: "0.8125rem", fontWeight: 600, cursor: available ? "pointer" : "not-allowed" }}>
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Symptoms */}
              <div className="form-group">
                <label className="form-label">Symptoms / Reason for Visit</label>
                <textarea name="symptoms" className="form-input" rows={3} placeholder="Describe your symptoms or reason for visit..."
                  value={form.symptoms} onChange={handleChange} style={{ resize: "vertical" }} />
              </div>

              {/* Emergency */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem", padding: "0.75rem", background: "#fff7ed", borderRadius: "var(--radius)", border: "1px solid #fed7aa" }}>
                <input type="checkbox" id="emergency" name="isEmergency" checked={form.isEmergency} onChange={handleChange}
                  style={{ width: 16, height: 16, accentColor: "var(--red-500)", cursor: "pointer" }} />
                <label htmlFor="emergency" style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", fontWeight: 600, color: "#c2410c", cursor: "pointer" }}>
                  <FaExclamationCircle /> Mark as Emergency Appointment
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-full btn-lg" disabled={bookingLoading || !form.timeSlot}>
                {bookingLoading ? <><span className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} /> Booking...</> : <><FaCheckCircle /> Confirm Appointment</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
