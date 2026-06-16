import React from "react";
import { Link } from "react-router-dom";
import { FaHospital, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer style={{ background: "var(--sky-900)", color: "white", marginTop: "auto" }}>
      <div className="container" style={{ padding: "3rem 1.5rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <FaHospital style={{ color: "var(--sky-400)", fontSize: "1.5rem" }} />
              <span style={{ fontSize: "1.25rem", fontWeight: 800 }}>HealthCare<span style={{ color: "var(--sky-400)" }}>+</span></span>
            </div>
            <p style={{ color: "var(--sky-200)", fontSize: "0.875rem", lineHeight: 1.7 }}>
              Your trusted partner for smart healthcare appointment management. Book, track, and manage your health journey with ease.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a key={i} href="#!" style={{ color: "var(--sky-300)", fontSize: "1.1rem", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.target.style.color = "white"}
                  onMouseLeave={(e) => e.target.style.color = "var(--sky-300)"}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--sky-300)" }}>Quick Links</h4>
            {[
              { to: "/", label: "Home" }, { to: "/doctors", label: "Find Doctors" },
              { to: "/symptom-checker", label: "Symptom Checker" }, { to: "/health-news", label: "Health News" },
              { to: "/about", label: "About Us" },
            ].map((link) => (
              <Link key={link.to} to={link.to} style={{ display: "block", color: "var(--sky-200)", fontSize: "0.875rem", marginBottom: "0.5rem", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.target.style.color = "white"}
                onMouseLeave={(e) => e.target.style.color = "var(--sky-200)"}>{link.label}</Link>
            ))}
          </div>

          {/* Specialities */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--sky-300)" }}>Specialities</h4>
            {["Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics", "Gynecology"].map((s) => (
              <Link key={s} to={`/doctors?specialization=${s}`} style={{ display: "block", color: "var(--sky-200)", fontSize: "0.875rem", marginBottom: "0.5rem", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.target.style.color = "white"}
                onMouseLeave={(e) => e.target.style.color = "var(--sky-200)"}>{s}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--sky-300)" }}>Contact Us</h4>
            {[
              { Icon: FaPhone, text: "+91 98765 43210" },
              { Icon: FaEnvelope, text: "support@healthcare.com" },
              { Icon: FaMapMarkerAlt, text: "123 Medical Plaza, Mumbai, India" },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", marginBottom: "0.75rem" }}>
                <Icon style={{ color: "var(--sky-400)", marginTop: "3px", flexShrink: 0 }} />
                <span style={{ color: "var(--sky-200)", fontSize: "0.875rem" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--sky-800)", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <p style={{ color: "var(--sky-300)", fontSize: "0.8125rem" }}>
            © {new Date().getFullYear()} HealthCare+. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((t) => (
              <a key={t} href="#!" style={{ color: "var(--sky-300)", fontSize: "0.8125rem", transition: "color 0.2s" }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
