import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaSave, FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    gender: user?.gender || "male",
    dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    address: user?.address || { street: "", city: "", state: "", pincode: "" },
  });
  const [passForm, setPassForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setProfileForm({ ...profileForm, address: { ...profileForm.address, [field]: value } });
    } else {
      setProfileForm({ ...profileForm, [name]: value });
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put("/auth/update-profile", profileForm);
      updateUser(data.user);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) return toast.error("Passwords don't match");
    setSavingPass(true);
    try {
      await api.put("/auth/change-password", passForm);
      toast.success("Password changed successfully!");
      setPassForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Change failed");
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container"><h1>My Profile</h1><p>Manage your account settings</p></div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem", maxWidth: 700 }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.5rem", background: "white", padding: "0.375rem", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow)", width: "fit-content" }}>
          {["profile", "security"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: "0.5rem 1.25rem", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.875rem", background: activeTab === tab ? "var(--sky-500)" : "transparent", color: activeTab === tab ? "white" : "var(--gray-600)", border: "none", cursor: "pointer", textTransform: "capitalize" }}>
              {tab === "profile" ? <><FaUser style={{ marginRight: "0.375rem" }} />Profile</> : <><FaLock style={{ marginRight: "0.375rem" }} />Security</>}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="card">
            {/* Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--sky-400), var(--sky-600))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "2rem", fontWeight: 700 }}>
                {user?.name?.[0]}
              </div>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--gray-900)" }}>{user?.name}</h3>
                <p style={{ color: "var(--sky-600)", fontWeight: 600, textTransform: "capitalize" }}>{user?.role}</p>
                <p style={{ color: "var(--gray-500)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.25rem" }}>
                  <FaEnvelope style={{ color: "var(--sky-400)" }} /> {user?.email}
                </p>
              </div>
            </div>

            <form onSubmit={saveProfile}>
              <div className="grid-2" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label"><FaUser style={{ marginRight: "0.375rem", color: "var(--sky-400)" }} />Full Name</label>
                  <input type="text" name="name" className="form-input" value={profileForm.name} onChange={handleProfileChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label"><FaPhone style={{ marginRight: "0.375rem", color: "var(--sky-400)" }} />Phone</label>
                  <input type="tel" name="phone" className="form-input" value={profileForm.phone} onChange={handleProfileChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select name="gender" className="form-input form-select" value={profileForm.gender} onChange={handleProfileChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" name="dob" className="form-input" value={profileForm.dob} onChange={handleProfileChange} />
                </div>
              </div>

              <h4 style={{ fontWeight: 700, margin: "1rem 0 0.75rem", color: "var(--gray-700)" }}>Address</h4>
              <div className="grid-2" style={{ gap: "1rem" }}>
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Street</label>
                  <input type="text" name="address.street" className="form-input" value={profileForm.address.street} onChange={handleProfileChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" name="address.city" className="form-input" value={profileForm.address.city} onChange={handleProfileChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input type="text" name="address.state" className="form-input" value={profileForm.address.state} onChange={handleProfileChange} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={savingProfile} style={{ marginTop: "0.5rem" }}>
                {savingProfile ? <><span className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</> : <><FaSave /> Save Changes</>}
              </button>
            </form>
          </div>
        )}

        {activeTab === "security" && (
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: "1.5rem", color: "var(--gray-800)" }}>Change Password</h3>
            <form onSubmit={changePassword}>
              {[
                { name: "oldPassword", label: "Current Password" },
                { name: "newPassword", label: "New Password" },
                { name: "confirmPassword", label: "Confirm New Password" },
              ].map(({ name, label }) => (
                <div key={name} className="form-group">
                  <label className="form-label">{label}</label>
                  <input type="password" name={name} className="form-input" placeholder="••••••••"
                    value={passForm[name]} onChange={(e) => setPassForm({ ...passForm, [e.target.name]: e.target.value })} required minLength={6} />
                </div>
              ))}
              <button type="submit" className="btn btn-primary btn-lg" disabled={savingPass}>
                {savingPass ? <><span className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} /> Changing...</> : <><FaLock /> Change Password</>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
