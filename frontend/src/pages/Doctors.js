import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch, FaStar, FaMapMarkerAlt, FaFilter, FaVideo, FaTimes } from "react-icons/fa";
import api from "../utils/api";

export default function Doctors() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    name: params.get("name") || "",
    specialization: params.get("specialization") || "",
    city: "",
    minFee: "",
    maxFee: "",
    rating: "",
  });
  const [specializations, setSpecializations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 9;

  useEffect(() => {
    api.get("/doctors/specializations").then(({ data }) => setSpecializations(data.specializations || []));
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [page, filters]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ ...filters, page, limit });
      const { data } = await api.get(`/doctors?${q}`);
      setDoctors(data.doctors || []);
      setTotal(data.total || 0);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ name: "", specialization: "", city: "", minFee: "", maxFee: "", rating: "" });
    setPage(1);
  };

  const pages = Math.ceil(total / limit);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Find Doctors</h1>
          <p>Search from {total}+ verified doctors across specializations</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {/* Search bar */}
        <div style={{ background: "white", borderRadius: "var(--radius-lg)", padding: "1.25rem", boxShadow: "var(--shadow)", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 220px" }}>
              <FaSearch style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--sky-400)" }} />
              <input type="text" name="name" className="form-input" style={{ paddingLeft: "2.5rem" }}
                placeholder="Search by doctor name..." value={filters.name} onChange={handleFilterChange} />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <select name="specialization" className="form-input form-select" value={filters.specialization} onChange={handleFilterChange}>
                <option value="">All Specializations</option>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" onClick={() => setShowFilters(!showFilters)}>
              <FaFilter /> {showFilters ? "Hide" : "More"} Filters
            </button>
            {Object.values(filters).some(Boolean) && (
              <button className="btn btn-outline" onClick={clearFilters}><FaTimes /> Clear</button>
            )}
          </div>

          {showFilters && (
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--gray-100)" }}>
              <input type="text" name="city" className="form-input" style={{ flex: "1 1 150px" }}
                placeholder="City" value={filters.city} onChange={handleFilterChange} />
              <input type="number" name="minFee" className="form-input" style={{ flex: "1 1 120px" }}
                placeholder="Min Fee (₹)" value={filters.minFee} onChange={handleFilterChange} />
              <input type="number" name="maxFee" className="form-input" style={{ flex: "1 1 120px" }}
                placeholder="Max Fee (₹)" value={filters.maxFee} onChange={handleFilterChange} />
              <select name="rating" className="form-input form-select" style={{ flex: "1 1 140px" }} value={filters.rating} onChange={handleFilterChange}>
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>
          )}
        </div>

        {/* Results */}
        <div style={{ marginBottom: "1rem", color: "var(--gray-500)", fontSize: "0.875rem" }}>
          Showing {doctors.length} of {total} doctors
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <div className="loader" style={{ width: 40, height: 40, borderWidth: 4 }} />
          </div>
        ) : doctors.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--gray-400)" }}>
            <FaSearch style={{ fontSize: "3rem", marginBottom: "1rem" }} />
            <h3>No doctors found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid-3">
            {doctors.map((doc) => (
              <div key={doc._id} className="card" style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    {doc.user?.avatar ? (
                      <img src={doc.user.avatar} alt={doc.user.name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--sky-200)" }} />
                    ) : (
                      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--sky-400), var(--sky-600))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.5rem", fontWeight: 700 }}>
                        {doc.user?.name?.[0]}
                      </div>
                    )}
                    {doc.isAvailable && <span style={{ position: "absolute", bottom: 2, right: 2, width: 10, height: 10, background: "var(--green-500)", borderRadius: "50%", border: "2px solid white" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.2rem", color: "var(--gray-900)" }}>Dr. {doc.user?.name}</h3>
                    <p style={{ color: "var(--sky-600)", fontWeight: 600, fontSize: "0.8125rem", marginBottom: "0.25rem" }}>{doc.specialization}</p>
                    <p style={{ color: "var(--gray-500)", fontSize: "0.8rem" }}>{doc.experience} years experience</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", margin: "0.75rem 0" }}>
                  {doc.user?.address?.city && (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem", color: "var(--gray-500)" }}>
                      <FaMapMarkerAlt style={{ color: "var(--sky-400)" }} /> {doc.user.address.city}
                    </span>
                  )}
                  {doc.telemedicineEnabled && (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", background: "#ede9fe", color: "#6d28d9", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-full)", fontWeight: 600 }}>
                      <FaVideo /> Video
                    </span>
                  )}
                  {doc.rating > 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem", color: "var(--gray-600)" }}>
                      <FaStar style={{ color: "#fbbf24" }} /> {doc.rating} ({doc.totalReviews})
                    </span>
                  )}
                </div>

                {doc.hospital && (
                  <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginBottom: "0.75rem" }}>🏥 {doc.hospital}</p>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>Consultation</span>
                    <p style={{ fontWeight: 800, color: "var(--sky-700)", fontSize: "1.125rem" }}>₹{doc.consultationFee}</p>
                  </div>
                  <Link to={`/doctors/${doc._id}`} className="btn btn-primary btn-sm">View Profile</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem" }}>
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`btn btn-sm ${page === p ? "btn-primary" : "btn-outline"}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
