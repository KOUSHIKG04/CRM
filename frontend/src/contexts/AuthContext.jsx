import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error.response?.data);
      throw (
        error.response?.data || { message: "An error occurred during login" }
      );
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/api/auth/register", userData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      return { success: true, user };
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      throw (
        error.response?.data || {
          message: "An error occurred during registration",
        }
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    axiosInstance: api,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
