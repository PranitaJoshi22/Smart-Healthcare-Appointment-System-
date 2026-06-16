import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hcToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — only redirect on 401, not on 500
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear token and redirect if not already on auth pages
      const publicPaths = ["/login", "/register", "/", "/doctors", "/symptom-checker", "/health-news", "/about"];
      const isPublic = publicPaths.some((p) => window.location.pathname === p || window.location.pathname.startsWith("/doctors/"));
      if (!isPublic) {
        localStorage.removeItem("hcToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
