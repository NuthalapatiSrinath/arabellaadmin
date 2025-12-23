import axios from "axios";
import { API_ROUTES } from "./apiRoutes"; // Adjust path if needed

// Create Axios instance
const apiClient = axios.create({
  // Ensure this matches your backend URL.
  // If you had a specific config here, keep it.
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- 1. REQUEST INTERCEPTOR (Existing) ---
// Attaches the token to every request if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 2. RESPONSE INTERCEPTOR (New Feature) ---
// Catches 401 Token Expired errors and redirects to login
apiClient.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // Check if the error is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or invalid token. Redirecting to login...");

      // 1. Clear any invalid data from LocalStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 2. Force Redirect to Login Page
      // We use window.location to ensure a full clear of the app state
      // preventing any circular dependency issues with Redux.
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Return the error so specific components can still handle it if needed
    return Promise.reject(error);
  }
);

export default apiClient;
