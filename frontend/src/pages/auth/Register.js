import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserMd, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "", gender: "male", role: "patient",
    specialization: "", experience: "", consultationFee: "", hospital: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(formData);
      toast.success(`Welcome to HealthCare+, ${user.name}!`);
      if (user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 140px)", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--sky-50), var(--sky-100))", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: "500px", animation: "fadeIn 0.4s ease" }}>
        <div className="card" style={{ padding: "2.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--gray-900)" }}>Create Account</h2>
            <p style={{ color: "var(--gray-500)", fontSize: "0.9rem", marginTop: "0.25rem" }}>Join HealthCare+ today</p>
          </div>

          {/* Role selector */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {["patient", "doctor"].map((role) => (
              <button key={role} type="button"
                onClick={() => setFormData({ ...formData, role })}
                style={{
                  flex: 1, padding: "0.75rem", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.875rem",
                  background: formData.role === role ? "var(--sky-500)" : "var(--gray-100)",
                  color: formData.role === role ? "white" : "var(--gray-600)",
                  border: `2px solid ${formData.role === role ? "var(--sky-500)" : "var(--gray-200)"}`,
                  cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                }}>
                {role === "patient" ? <FaUser /> : <FaUserMd />}
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: "1rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <div style={{ position: "relative" }}>
                  <FaUser style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--sky-400)" }} />
                  <input type="text" name="name" className="form-input" style={{ paddingLeft: "2.5rem" }}
                    placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone</label>
                <div style={{ position: "relative" }}>
                  <FaPhone style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--sky-400)" }} />
                  <input type="tel" name="phone" className="form-input" style={{ paddingLeft: "2.5rem" }}
                    placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <FaEnvelope style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--sky-400)" }} />
                <input type="email" name="email" className="form-input" style={{ paddingLeft: "2.5rem" }}
                  placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid-2" style={{ gap: "1rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Password</label>
                <div style={{ position: "relative" }}>
                  <FaLock style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--sky-400)" }} />
                  <input type={showPass ? "text" : "password"} name="password" className="form-input" style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                    placeholder="Min 6 characters" value={formData.password} onChange={handleChange} required minLength={6} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--gray-400)", cursor: "pointer" }}>
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Gender</label>
                <select name="gender" className="form-input form-select" value={formData.gender} onChange={handleChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Doctor specific fields */}
            {formData.role === "doctor" && (
              <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--sky-50)", borderRadius: "var(--radius)", border: "1px solid var(--sky-200)" }}>
                <p style={{ fontWeight: 700, color: "var(--sky-700)", marginBottom: "0.75rem", fontSize: "0.875rem" }}>Doctor Information</p>
                <div className="grid-2" style={{ gap: "1rem" }}>
                  <div className="form-group" style={{ marginBottom: "0.75rem" }}>
                    <label className="form-label">Specialization</label>
                    <select name="specialization" className="form-input form-select" value={formData.specialization} onChange={handleChange} required>
                      <option value="">Select...</option>
                      {["General Physician","Cardiologist","Neurologist","Orthopedist","Dermatologist","Pediatrician","Gynecologist","ENT","Ophthalmologist","Psychiatrist","Oncologist","Gastroenterologist"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: "0.75rem" }}>
                    <label className="form-label">Experience (years)</label>
                    <input type="number" name="experience" className="form-input" placeholder="5"
                      value={formData.experience} onChange={handleChange} min="0" />
                  </div>
                  <div className="form-group" style={{ marginBottom: "0.75rem" }}>
                    <label className="form-label">Consultation Fee (₹)</label>
                    <input type="number" name="consultationFee" className="form-input" placeholder="500"
                      value={formData.consultationFee} onChange={handleChange} min="0" />
                  </div>
                  <div className="form-group" style={{ marginBottom: "0.75rem" }}>
                    <label className="form-label">Hospital / Clinic</label>
                    <input type="text" name="hospital" className="form-input" placeholder="City Hospital"
                      value={formData.hospital} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} style={{ marginTop: "1.25rem" }}>
              {loading ? <><span className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating account...</> : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.875rem", color: "var(--gray-500)" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--sky-600)", fontWeight: 700 }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
