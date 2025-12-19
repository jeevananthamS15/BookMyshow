// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;
        case 403:
          console.error("Forbidden: You don't have permission to access this resource");
          break;
        case 404:
          console.error("Not Found: The requested resource was not found");
          break;
        case 500:
          console.error("Server Error: Something went wrong on the server");
          break;
        default:
          console.error(`Error ${status}: ${data.message || "An error occurred"}`);
      }
    } else if (error.request) {
      console.error("Network Error: No response from server");
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;