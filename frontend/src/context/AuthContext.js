import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("hcToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/auth/me");
      if (data?.user) setUser(data.user);
    } catch (err) {
      // Token invalid or server error — clear token silently
      localStorage.removeItem("hcToken");
      delete api.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("hcToken", data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    localStorage.setItem("hcToken", data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("hcToken");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
