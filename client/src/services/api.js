import axios from "axios";

// ==========================================
// Axios Instance
// ==========================================

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
      ? "https://ai-resume-analyzer-0wox.onrender.com/api"
      : "http://localhost:5000/api"),

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 30000,

  withCredentials: true,
});

// ==========================================
// Request Interceptor
// ==========================================

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// Response Interceptor
// ==========================================

API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (
        window.location.pathname !==
        "/login"
      ) {
        window.location.href =
          "/login";
      }
    }

    if (
      error.response?.status === 403
    ) {
      console.error(
        "Permission denied."
      );
    }

    if (
      error.response?.status >= 500
    ) {
      console.error(
        "Server Error."
      );
    }

    return Promise.reject(error);
  }
);

export default API;