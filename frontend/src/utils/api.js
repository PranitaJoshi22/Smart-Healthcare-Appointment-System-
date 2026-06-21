import axios from "axios";

// In production, set REACT_APP_API_URL to your backend Vercel URL
// e.g. https://your-backend.vercel.app/api
// In development, the proxy in package.json handles /api → localhost:5000
const baseURL = process.env.REACT_APP_API_URL || "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hcToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const publicPaths = ["/login", "/register", "/", "/doctors", "/symptom-checker", "/health-news", "/about"];
      const isPublic = publicPaths.some(
        (p) => window.location.pathname === p || window.location.pathname.startsWith("/doctors/")
      );
      if (!isPublic) {
        localStorage.removeItem("hcToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
