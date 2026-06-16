import React, { useState, useEffect } from "react";
import { FaNewspaper, FaSearch } from "react-icons/fa";
import api from "../utils/api";

const CATEGORIES = ["All", "Cardiology", "Technology", "Mental Health", "Endocrinology", "Preventive Care"];

export default function HealthNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = activeCategory !== "All" ? `?category=${activeCategory}` : "";
    setLoading(true);
    api.get(`/news${q}`).then(({ data }) => setNews(data.news || [])).finally(() => setLoading(false));
  }, [activeCategory]);

  const filtered = news.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.summary.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><FaNewspaper style={{ marginRight: "0.5rem" }} /> Health News</h1>
          <p>Stay informed with the latest healthcare updates</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {/* Search & filters */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 240px" }}>
            <FaSearch style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--sky-400)" }} />
            <input type="text" className="form-input" style={{ paddingLeft: "2.5rem" }}
              placeholder="Search news..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm ${activeCategory === cat ? "btn-primary" : "btn-outline"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}><div className="loader" style={{ width: 40, height: 40, borderWidth: 4 }} /></div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--gray-400)" }}>No news found</div>
        ) : (
          <div className="grid-3">
            {filtered.map((article) => (
              <div key={article.id} className="card" style={{ padding: 0, overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}>
                <img src={article.image} alt={article.title} style={{ width: "100%", height: 200, objectFit: "cover" }} />
                <div style={{ padding: "1.25rem" }}>
                  <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", background: "var(--sky-100)", color: "var(--sky-700)", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.625rem" }}>{article.category}</span>
                  <h4 style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.5rem", color: "var(--gray-800)", lineHeight: 1.4 }}>{article.title}</h4>
                  <p style={{ fontSize: "0.8125rem", color: "var(--gray-500)", lineHeight: 1.6, marginBottom: "0.75rem" }}>{article.summary}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--gray-400)" }}>
                    <span>{article.source}</span>
                    <span>{new Date(article.date).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
