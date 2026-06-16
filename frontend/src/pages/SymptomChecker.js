import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFlask, FaPlus, FaTimes, FaArrowRight, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import api from "../utils/api";

const urgencyConfig = {
  low: { color: "#22c55e", bg: "#dcfce7", label: "Low Urgency", icon: <FaCheckCircle />, desc: "Monitor your symptoms. Schedule a regular appointment." },
  medium: { color: "#f59e0b", bg: "#fef3c7", label: "Medium Urgency", icon: <FaInfoCircle />, desc: "Consider scheduling an appointment soon." },
  high: { color: "#ef4444", bg: "#fee2e2", label: "High Urgency", icon: <FaExclamationTriangle />, desc: "Seek medical attention promptly!" },
};

export default function SymptomChecker() {
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/symptoms/list").then(({ data }) => setAvailableSymptoms(data.symptoms || []));
  }, []);

  const addSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const addCustomSymptom = () => {
    const trimmed = customSymptom.trim().toLowerCase();
    if (trimmed && !selectedSymptoms.includes(trimmed)) {
      setSelectedSymptoms([...selectedSymptoms, trimmed]);
      setCustomSymptom("");
    }
  };

  const checkSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post("/symptoms/check", { symptoms: selectedSymptoms });
      setResult(data.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const urgency = result ? urgencyConfig[result.urgency] : null;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><FaFlask style={{ marginRight: "0.5rem" }} /> AI Symptom Checker</h1>
          <p>Select your symptoms for an instant preliminary health analysis</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem", maxWidth: 900 }}>
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "var(--radius)", padding: "0.875rem 1rem", marginBottom: "1.5rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
          <FaExclamationTriangle style={{ color: "#f59e0b", marginTop: "2px", flexShrink: 0 }} />
          <p style={{ fontSize: "0.875rem", color: "#92400e" }}>
            <strong>Medical Disclaimer:</strong> This tool provides preliminary information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.
          </p>
        </div>

        <div className="grid-2" style={{ gap: "2rem" }}>
          {/* Left - Input */}
          <div>
            <div className="card">
              <h3 style={{ marginBottom: "1.25rem", fontWeight: 700, color: "var(--gray-800)" }}>Select Your Symptoms</h3>

              {/* Common symptoms */}
              <div style={{ marginBottom: "1.25rem" }}>
                <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--gray-500)", marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Common Symptoms</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {availableSymptoms.map((symptom) => (
                    <button key={symptom} onClick={() => addSymptom(symptom)}
                      className={selectedSymptoms.includes(symptom) ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
                      style={{ textTransform: "capitalize" }}>
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom input */}
              <div style={{ marginBottom: "1.25rem" }}>
                <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--gray-500)", marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Add Custom Symptom</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="text" className="form-input" placeholder="Type a symptom..."
                    value={customSymptom} onChange={(e) => setCustomSymptom(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomSymptom()} />
                  <button className="btn btn-primary" onClick={addCustomSymptom}><FaPlus /></button>
                </div>
              </div>

              {/* Selected symptoms */}
              {selectedSymptoms.length > 0 && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--gray-500)", marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Selected ({selectedSymptoms.length})
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {selectedSymptoms.map((s) => (
                      <span key={s} style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "var(--sky-100)", color: "var(--sky-700)", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)", fontSize: "0.8125rem", fontWeight: 600 }}>
                        {s}
                        <FaTimes style={{ cursor: "pointer", fontSize: "0.7rem" }} onClick={() => removeSymptom(s)} />
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button className="btn btn-primary w-full btn-lg" onClick={checkSymptoms}
                disabled={loading || selectedSymptoms.length === 0}>
                {loading ? <><span className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing...</> : <><FaFlask /> Analyze Symptoms</>}
              </button>
            </div>
          </div>

          {/* Right - Results */}
          <div>
            {!result && !loading && (
              <div className="card" style={{ textAlign: "center", padding: "3rem 2rem", color: "var(--gray-400)" }}>
                <FaFlask style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--sky-200)" }} />
                <h4 style={{ color: "var(--gray-500)" }}>Select symptoms and click Analyze</h4>
                <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Get instant health insights and doctor recommendations</p>
              </div>
            )}

            {result && (
              <div className="animate-fadeIn">
                {/* Urgency */}
                <div className="card" style={{ background: urgency.bg, border: `1.5px solid ${urgency.color}`, marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.5rem", color: urgency.color }}>{urgency.icon}</span>
                    <div>
                      <p style={{ fontWeight: 800, color: urgency.color, fontSize: "1.0625rem" }}>{urgency.label}</p>
                      <p style={{ fontSize: "0.875rem", color: "var(--gray-600)", marginTop: "0.125rem" }}>{urgency.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Possible conditions */}
                <div className="card" style={{ marginBottom: "1rem" }}>
                  <h4 style={{ fontWeight: 700, marginBottom: "0.75rem", color: "var(--gray-800)" }}>Possible Conditions</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {result.possibleConditions.map((c) => (
                      <span key={c} style={{ background: "var(--sky-100)", color: "var(--sky-700)", padding: "0.25rem 0.625rem", borderRadius: "var(--radius-full)", fontSize: "0.8125rem", fontWeight: 600 }}>{c}</span>
                    ))}
                  </div>
                </div>

                {/* Recommended specialists */}
                <div className="card" style={{ marginBottom: "1rem" }}>
                  <h4 style={{ fontWeight: 700, marginBottom: "0.75rem", color: "var(--gray-800)" }}>Consult These Specialists</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {result.recommendedSpecialists.map((s) => (
                      <Link key={s} to={`/doctors?specialization=${s}`}
                        style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "#dcfce7", color: "#166534", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)", fontSize: "0.8125rem", fontWeight: 600, transition: "opacity 0.2s" }}>
                        {s} <FaArrowRight style={{ fontSize: "0.65rem" }} />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                {result.tips.length > 0 && (
                  <div className="card" style={{ marginBottom: "1rem" }}>
                    <h4 style={{ fontWeight: 700, marginBottom: "0.75rem", color: "var(--gray-800)" }}>Health Tips</h4>
                    <ul style={{ paddingLeft: "1.25rem" }}>
                      {result.tips.map((tip, i) => (
                        <li key={i} style={{ fontSize: "0.875rem", color: "var(--gray-600)", marginBottom: "0.375rem" }}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p style={{ fontSize: "0.75rem", color: "var(--gray-400)", fontStyle: "italic", textAlign: "center" }}>{result.disclaimer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
