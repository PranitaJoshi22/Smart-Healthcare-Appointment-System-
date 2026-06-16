import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch, FaCalendarCheck, FaUserMd, FaHeartbeat, FaVideo,
  FaStar, FaArrowRight, FaShieldAlt, FaClock, FaMobileAlt,
  FaFlask, FaNewspaper, FaAmbulance,
} from "react-icons/fa";
import api from "../utils/api";
import "./Home.css";

const specializations = [
  { name: "Cardiology", icon: "❤️", color: "#fee2e2" },
  { name: "Neurology", icon: "🧠", color: "#ede9fe" },
  { name: "Orthopedics", icon: "🦴", color: "#fef9c3" },
  { name: "Dermatology", icon: "🌿", color: "#dcfce7" },
  { name: "Pediatrics", icon: "👶", color: "#e0f2fe" },
  { name: "Gynecology", icon: "🌸", color: "#fce7f3" },
  { name: "Ophthalmology", icon: "👁️", color: "#dbeafe" },
  { name: "ENT", icon: "👂", color: "#d1fae5" },
];

const features = [
  { icon: <FaCalendarCheck />, title: "Easy Booking", desc: "Book appointments in under 2 minutes, 24/7 online." },
  { icon: <FaVideo />, title: "Telemedicine", desc: "Consult doctors via video call from your home." },
  { icon: <FaFlask />, title: "Symptom Checker", desc: "AI-powered symptom analysis and doctor recommendations." },
  { icon: <FaShieldAlt />, title: "Secure & Private", desc: "Your health data is encrypted and fully protected." },
  { icon: <FaClock />, title: "Real-time Slots", desc: "See live doctor availability and book instantly." },
  { icon: <FaMobileAlt />, title: "Smart Reminders", desc: "Get automated reminders so you never miss appointments." },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.get("/doctors?limit=4")
      .then(({ data }) => setDoctors(data.doctors || []))
      .catch(() => setDoctors([]));
    api.get("/news")
      .then(({ data }) => setNews((data.news || []).slice(0, 3)))
      .catch(() => setNews([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/doctors?name=${search}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-text animate-fadeIn">
            <div className="hero-badge"><FaHeartbeat /> Smart Healthcare Platform</div>
            <h1>Your Health, Our <span className="hero-highlight">Priority</span></h1>
            <p>Book appointments with top doctors, check symptoms, consult via video, and manage your complete health journey — all in one place.</p>
            <form className="hero-search" onSubmit={handleSearch}>
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search doctors, specializations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
            <div className="hero-stats">
              {[["500+", "Doctors"], ["50K+", "Patients"], ["4.8★", "Rating"], ["24/7", "Support"]].map(([val, label]) => (
                <div key={label} className="stat-item">
                  <span className="stat-val">{val}</span>
                  <span className="stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-image animate-fadeIn">
            <div className="hero-card-float card1">
              <FaCalendarCheck style={{ color: "var(--sky-500)" }} />
              <span>Appointment Booked!</span>
            </div>
            <div className="hero-card-float card2">
              <FaVideo style={{ color: "#8b5cf6" }} />
              <span>Video Consult Ready</span>
            </div>
            <div className="hero-img-box">
              <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80" alt="Healthcare" />
            </div>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Browse by <span className="text-sky">Specialization</span></h2>
            <p>Find the right specialist for your health needs</p>
          </div>
          <div className="spec-grid">
            {specializations.map((spec) => (
              <Link key={spec.name} to={`/doctors?specialization=${spec.name}`} className="spec-card" style={{ "--spec-bg": spec.color }}>
                <div className="spec-icon">{spec.icon}</div>
                <span>{spec.name}</span>
                <FaArrowRight className="spec-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose <span className="text-sky">HealthCare+</span></h2>
            <p>Everything you need for better healthcare management</p>
          </div>
          <div className="grid-3">
            {features.map((f) => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Doctors */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Top <span className="text-sky">Doctors</span></h2>
            <p>Meet our highly rated medical professionals</p>
          </div>
          <div className="grid-4">
            {doctors.length > 0 ? doctors.map((doc) => (
              <div key={doc._id} className="doctor-card card">
                <div className="doctor-avatar">
                  {doc.user?.avatar ? (
                    <img src={doc.user.avatar} alt={doc.user.name} />
                  ) : (
                    <div className="avatar-placeholder">{doc.user?.name?.[0]}</div>
                  )}
                  {doc.isAvailable && <span className="available-dot" />}
                </div>
                <h4>{doc.user?.name}</h4>
                <p className="doc-spec">{doc.specialization}</p>
                <div className="doc-meta">
                  <span><FaStar style={{ color: "#fbbf24" }} /> {doc.rating || "New"}</span>
                  <span>{doc.experience} yrs exp</span>
                </div>
                <div className="doc-fee">₹{doc.consultationFee}</div>
                <Link to={`/doctors/${doc._id}`} className="btn btn-primary btn-sm w-full" style={{ marginTop: "0.75rem" }}>
                  Book Now
                </Link>
              </div>
            )) : (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--gray-400)" }}>
                Loading doctors...
              </div>
            )}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link to="/doctors" className="btn btn-outline btn-lg">View All Doctors <FaArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* Symptom Checker CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <div className="cta-icon-box"><FaFlask size={32} /></div>
              <div>
                <h2>Not sure which doctor to see?</h2>
                <p>Use our AI Symptom Checker to analyze your symptoms and get personalized doctor recommendations instantly.</p>
              </div>
            </div>
            <div className="cta-actions">
              <Link to="/symptom-checker" className="btn btn-primary btn-lg">
                Check Symptoms <FaArrowRight />
              </Link>
              <Link to="/doctors" className="btn btn-outline btn-lg" style={{ color: "white", borderColor: "white" }}>
                Browse Doctors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Health News */}
      {news.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Latest <span className="text-sky">Health News</span></h2>
              <p>Stay updated with the latest in healthcare</p>
            </div>
            <div className="grid-3">
              {news.map((article) => (
                <div key={article.id} className="news-card card">
                  <img src={article.image} alt={article.title} className="news-img" />
                  <div className="news-body">
                    <span className="news-cat">{article.category}</span>
                    <h4>{article.title}</h4>
                    <p>{article.summary.slice(0, 100)}...</p>
                    <div className="news-meta">
                      <span>{article.date}</span>
                      <span>{article.source}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Link to="/health-news" className="btn btn-outline btn-lg">
                <FaNewspaper /> View All News
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Emergency */}
      <section className="emergency-section">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <FaAmbulance style={{ fontSize: "2.5rem", color: "#ef4444" }} />
            <div>
              <h3 style={{ color: "var(--gray-900)", fontWeight: 800 }}>Medical Emergency?</h3>
              <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>Book an emergency appointment instantly</p>
            </div>
          </div>
          <Link to="/doctors" className="btn btn-danger btn-lg">Book Emergency Appointment</Link>
        </div>
      </section>
    </div>
  );
}
