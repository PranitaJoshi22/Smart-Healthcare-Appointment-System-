import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaHospital, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 140px)", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--sky-50) 0%, var(--sky-100) 100%)", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: "440px", animation: "fadeIn 0.4s ease" }}>
        <div className="card" style={{ padding: "2.5rem" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <div style={{ width: 60, height: 60, background: "linear-gradient(135deg, var(--sky-500), var(--sky-700))", borderRadius: "var(--radius-xl)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FaHospital style={{ color: "white", fontSize: "1.5rem" }} />
              </div>
            </div>
            <h2 style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--gray-900)" }}>Welcome Back</h2>
            <p style={{ color: "var(--gray-500)", marginTop: "0.25rem", fontSize: "0.9rem" }}>Sign in to your HealthCare+ account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <FaEnvelope style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--sky-400)" }} />
                <input type="email" name="email" className="form-input" style={{ paddingLeft: "2.5rem" }}
                  placeholder="doctor@example.com" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <FaLock style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--sky-400)" }} />
                <input type={showPass ? "text" : "password"} name="password" className="form-input" style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                  placeholder="Enter password" value={formData.password} onChange={handleChange} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--gray-400)", cursor: "pointer" }}>
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} style={{ marginTop: "0.5rem" }}>
              {loading ? <><span className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</> : "Sign In"}
            </button>
          </form>

          {/* Demo accounts */}
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--sky-50)", borderRadius: "var(--radius)", border: "1px solid var(--sky-200)" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--sky-700)", marginBottom: "0.5rem" }}>DEMO ACCOUNTS</p>
            {[
              { role: "Patient", email: "patient@demo.com", pass: "demo123" },
              { role: "Doctor", email: "doctor@demo.com", pass: "demo123" },
              { role: "Admin", email: "admin@demo.com", pass: "demo123" },
            ].map((d) => (
              <button key={d.role} onClick={() => setFormData({ email: d.email, password: d.pass })}
                style={{ display: "block", fontSize: "0.8rem", color: "var(--sky-700)", background: "none", border: "none", cursor: "pointer", marginBottom: "0.2rem", fontWeight: 500 }}>
                {d.role}: {d.email}
              </button>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.875rem", color: "var(--gray-500)" }}>
            Don't have an account? <Link to="/register" style={{ color: "var(--sky-600)", fontWeight: 700 }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
