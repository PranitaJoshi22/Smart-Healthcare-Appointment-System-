import React from "react";
import { Link } from "react-router-dom";
import { FaHospital, FaUserMd, FaHeartbeat, FaShieldAlt, FaVideo, FaFlask, FaArrowRight } from "react-icons/fa";

export default function About() {
  const team = [
    { name: "Dr. Rajesh Kumar", role: "Chief Medical Officer", spec: "Cardiologist" },
    { name: "Priya Sharma", role: "Head of Technology", spec: "Healthcare IT" },
    { name: "Dr. Anjali Singh", role: "Medical Director", spec: "General Medicine" },
    { name: "Vikram Patel", role: "Product Lead", spec: "Digital Health" },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>About HealthCare+</h1>
          <p>Transforming healthcare through technology and compassion</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {/* Mission */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center", padding: "3rem 0", borderBottom: "1px solid var(--gray-100)", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--sky-100)", color: "var(--sky-700)", padding: "0.375rem 0.875rem", borderRadius: "var(--radius-full)", fontWeight: 600, fontSize: "0.875rem", marginBottom: "1rem" }}>
              <FaHeartbeat /> Our Mission
            </div>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "1rem", lineHeight: 1.2 }}>
              Making Quality Healthcare Accessible to Everyone
            </h2>
            <p style={{ color: "var(--gray-600)", lineHeight: 1.8, marginBottom: "1rem" }}>
              HealthCare+ was founded with a simple mission: to bridge the gap between patients and healthcare providers using smart technology. We believe that quality healthcare should be accessible, convenient, and affordable for everyone.
            </p>
            <p style={{ color: "var(--gray-600)", lineHeight: 1.8 }}>
              Our platform connects patients with verified doctors, enables seamless appointment booking, provides AI-powered health insights, and supports telemedicine consultations — all in one secure platform.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { icon: <FaUserMd />, val: "500+", label: "Verified Doctors", color: "var(--sky-500)" },
              { icon: <FaHeartbeat />, val: "50K+", label: "Happy Patients", color: "#22c55e" },
              { icon: <FaVideo />, val: "10K+", label: "Video Consults", color: "#8b5cf6" },
              { icon: <FaShieldAlt />, val: "100%", label: "Secure & Private", color: "#f59e0b" },
            ].map(({ icon, val, label, color }) => (
              <div key={label} className="card" style={{ textAlign: "center", padding: "1.25rem" }}>
                <div style={{ fontSize: "1.5rem", color, marginBottom: "0.5rem" }}>{icon}</div>
                <p style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--gray-900)" }}>{val}</p>
                <p style={{ fontSize: "0.8125rem", color: "var(--gray-500)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ padding: "3rem 0", borderBottom: "1px solid var(--gray-100)" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--gray-900)", textAlign: "center", marginBottom: "2rem" }}>
            What Makes Us <span style={{ color: "var(--sky-600)" }}>Different</span>
          </h2>
          <div className="grid-3">
            {[
              { icon: <FaFlask />, title: "AI Symptom Checker", desc: "Our intelligent symptom analysis engine helps patients identify possible conditions and find the right specialist before booking." },
              { icon: <FaVideo />, title: "Telemedicine", desc: "Instant video consultations with doctors from the comfort of your home, reducing unnecessary hospital visits." },
              { icon: <FaShieldAlt />, title: "Secure Health Records", desc: "All your medical records, prescriptions, and reports stored securely in one place, accessible anytime." },
              { icon: <FaHeartbeat />, title: "Real-time Availability", desc: "Live doctor availability with instant slot booking and automated appointment confirmation." },
              { icon: <FaHospital />, title: "Verified Doctors", desc: "All doctors on our platform go through a rigorous verification process before being approved to practice." },
              { icon: <FaUserMd />, title: "Smart Recommendations", desc: "Based on your symptoms and location, we recommend the most suitable doctors for your needs." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ textAlign: "center" }}>
                <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, var(--sky-100), var(--sky-200))", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.375rem", color: "var(--sky-600)", margin: "0 auto 1rem" }}>{icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--gray-800)" }}>{title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "1rem" }}>Ready to take control of your health?</h2>
          <p style={{ color: "var(--gray-500)", marginBottom: "1.5rem", fontSize: "1.0625rem" }}>Join thousands of patients who trust HealthCare+ for their healthcare needs.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free <FaArrowRight /></Link>
            <Link to="/doctors" className="btn btn-outline btn-lg">Browse Doctors</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
