import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUsers, FaTrash, FaSearch } from "react-icons/fa";
import api from "../../utils/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = roleFilter !== "all" ? `?role=${roleFilter}` : "";
      const { data } = await api.get(`/admin/users${q}`);
      setUsers(data.users || []);
    } finally { setLoading(false); }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user ${name}?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const roleColors = { patient: { bg: "var(--sky-100)", color: "var(--sky-700)" }, doctor: { bg: "#dcfce7", color: "#166534" }, admin: { bg: "#fef9c3", color: "#92400e" } };

  return (
    <div>
      <div className="page-header">
        <div className="container"><h1>Manage Users</h1><p>View and manage all registered users</p></div>
      </div>
      <div className="container" style={{ paddingBottom: "3rem" }}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <FaSearch style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--sky-400)" }} />
            <input type="text" className="form-input" style={{ paddingLeft: "2.5rem" }} placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: "0.375rem" }}>
            {["all", "patient", "doctor", "admin"].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                style={{ padding: "0.5rem 0.875rem", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.875rem", background: roleFilter === r ? "var(--sky-500)" : "white", color: roleFilter === r ? "white" : "var(--gray-600)", border: `1.5px solid ${roleFilter === r ? "var(--sky-500)" : "var(--gray-200)"}`, cursor: "pointer", textTransform: "capitalize" }}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {loading ? <div style={{ textAlign: "center", padding: "4rem" }}><div className="loader" style={{ width: 40, height: 40, borderWidth: 4 }} /></div> : (
          <div style={{ background: "white", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--sky-50)", borderBottom: "1px solid var(--gray-200)" }}>
                  {["User", "Email", "Phone", "Role", "Joined", "Actions"].map(h => (
                    <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.8125rem", fontWeight: 700, color: "var(--gray-600)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => {
                  const rc = roleColors[user.role] || roleColors.patient;
                  return (
                    <tr key={user._id} style={{ borderBottom: "1px solid var(--gray-100)", transition: "background 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--sky-50)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, var(--sky-400), var(--sky-600))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.875rem" }}>{user.name[0]}</div>
                          <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--gray-600)" }}>{user.email}</td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--gray-600)" }}>{user.phone || "—"}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span style={{ padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700, background: rc.bg, color: rc.color, textTransform: "capitalize" }}>{user.role}</span>
                      </td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: "var(--gray-500)" }}>{new Date(user.createdAt).toLocaleDateString("en-IN")}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <button onClick={() => deleteUser(user._id, user.name)} className="btn btn-danger btn-sm"><FaTrash /></button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && <tr><td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "var(--gray-400)" }}>No users found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
