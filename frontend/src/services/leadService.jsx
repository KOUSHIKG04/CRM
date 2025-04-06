import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getLeads = async () => {
  try {
    const response = await api.get("/api/leads");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch leads" };
  }
};

export const addLead = async (leadData) => {
  try {
    const response = await api.post("/api/leads", leadData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add lead" };
  }
};

export const updateLead = async (id, leadData) => {
  try {
    const response = await api.patch(`/api/leads/${id}`, leadData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update lead" };
  }
};

export const deleteLead = async (id) => {
  try {
    const response = await api.delete(`/api/leads/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete lead" };
  }
};

export const updateLeadStatus = async (id, status) => {
  try {
    const response = await api.patch(`/api/leads/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update lead status" };
  }
};
