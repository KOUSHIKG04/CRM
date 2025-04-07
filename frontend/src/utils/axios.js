import axios from "axios";

const instance = axios.create({
  baseURL: "https://crm-37w0.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to requests
instance.interceptors.request.use(
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

// Add a response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 500:
          // Server error
          console.error("Server error");
          break;
        default:
          console.error("API Error:", error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
