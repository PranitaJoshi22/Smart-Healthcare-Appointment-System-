import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaGraduationCap, FaVideo, FaHospital, FaClock, FaLanguage, FaCheckCircle } from "react-icons/fa";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function DoctorDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/doctors/${id}`),
      api.get(`/reviews/doctor/${id}`),
    ]).then(([d, r]) => {
      setDoctor(d.data.doctor);
      setReviews(r.data.reviews || []);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: "center", padding: "4rem" }}><div className="loader" style={{ width: 40, height: 40, borderWidth: 4 }} /></div>;
  if (!doctor) return <div style={{ padding: "4rem", textAlign: "center" }}>Doctor not found</div>;

  const renderStars = (rating) => Array.from({ length: 5 }, (_, i) => (
    <FaStar key={i} style={{ color: i < rating ? "#fbbf24" : "var(--gray-200)", fontSize: "0.875rem" }} />
  ));

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Doctor Profile</h1>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem", maxWidth: 1000 }}>
        {/* Main profile card */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              {doctor.user?.avatar ? (
                <img src={doctor.user.avatar} alt={doctor.user.name} style={{ width: 120, height: 120, borderRadius: "var(--radius-xl)", objectFit: "cover", border: "4px solid var(--sky-200)" }} />
              ) : (
                <div style={{ width: 120, height: 120, borderRadius: "var(--radius-xl)", background: "linear-gradient(135deg, var(--sky-400), var(--sky-700))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "3rem", fontWeight: 700 }}>
                  {doctor.user?.name?.[0]}
                </div>
              )}
              {doctor.isAvailable && (
                <div style={{ position: "absolute", bottom: 6, right: 6, background: "#22c55e", color: "white", fontSize: "0.7rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "var(--radius-full)", border: "2px solid white" }}>Available</div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--gray-900)" }}>Dr. {doctor.user?.name}</h2>
                  <p style={{ color: "var(--sky-600)", fontWeight: 700, fontSize: "1.0625rem" }}>{doctor.specialization}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.25rem" }}>
                    {renderStars(Math.round(doctor.rating))}
                    <span style={{ fontSize: "0.875rem", color: "var(--gray-600)", marginLeft: "0.25rem" }}>{doctor.rating} ({doctor.totalReviews} reviews)</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.875rem", color: "var(--gray-400)" }}>Consultation Fee</p>
                  <p style={{ fontSize: "2rem", fontWeight: 900, color: "var(--sky-700)" }}>₹{doctor.consultationFee}</p>
                  {user?.role === "patient" ? (
                    <Link to={`/book-appointment/${doctor._id}`} className="btn btn-primary">Book Appointment</Link>
                  ) : !user ? (
                    <Link to="/login" className="btn btn-primary">Login to Book</Link>
                  ) : null}
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", marginTop: "1.25rem" }}>
                {[
                  { icon: <FaClock />, text: `${doctor.experience} Years Experience` },
                  { icon: <FaHospital />, text: doctor.hospital || "Online" },
                  { icon: <FaLanguage />, text: doctor.languages?.join(", ") || "English" },
                  ...(doctor.telemedicineEnabled ? [{ icon: <FaVideo />, text: "Video Consult Available", highlight: true }] : []),
                ].map(({ icon, text, highlight }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: highlight ? "#8b5cf6" : "var(--gray-600)" }}>
                    <span style={{ color: highlight ? "#8b5cf6" : "var(--sky-500)" }}>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {doctor.bio && (
            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--gray-100)" }}>
              <h4 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>About</h4>
              <p style={{ color: "var(--gray-600)", lineHeight: 1.7 }}>{doctor.bio}</p>
            </div>
          )}
        </div>

        <div className="grid-2" style={{ gap: "1.5rem", alignItems: "start" }}>
          {/* Qualifications */}
          {doctor.qualification?.length > 0 && (
            <div className="card">
              <h4 style={{ fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--gray-800)" }}>
                <FaGraduationCap style={{ color: "var(--sky-500)" }} /> Qualifications
              </h4>
              {doctor.qualification.map((q, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0", borderBottom: "1px solid var(--gray-100)" }}>
                  <FaCheckCircle style={{ color: "var(--sky-500)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.9rem", color: "var(--gray-700)" }}>{q}</span>
                </div>
              ))}
            </div>
          )}

          {/* Available days */}
          {doctor.availableSlots?.length > 0 && (
            <div className="card">
              <h4 style={{ fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--gray-800)" }}>
                <FaClock style={{ color: "var(--sky-500)" }} /> Available Days
              </h4>
              {doctor.availableSlots.map((slot, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--gray-100)", fontSize: "0.875rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--gray-700)" }}>{slot.day}</span>
                  <span style={{ color: "var(--sky-600)" }}>{slot.startTime} – {slot.endTime}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="card" style={{ marginTop: "1.5rem" }}>
            <h4 style={{ fontWeight: 700, marginBottom: "1.25rem", color: "var(--gray-800)" }}>Patient Reviews ({reviews.length})</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {reviews.slice(0, 5).map((review) => (
                <div key={review._id} style={{ padding: "1rem", background: "var(--gray-50)", borderRadius: "var(--radius)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: 600, color: "var(--gray-700)" }}>{review.patient?.name || "Patient"}</span>
                    <div style={{ display: "flex", gap: "2px" }}>{renderStars(review.rating)}</div>
                  </div>
                  {review.comment && <p style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>{review.comment}</p>}
                  <p style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: "0.25rem" }}>{new Date(review.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
