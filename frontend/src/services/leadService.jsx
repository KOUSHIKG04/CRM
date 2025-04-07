import axios from "../utils/axios";

export const getLeads = async () => {
  const response = await axios.get("/api/leads");
  return response.data;
};

export const addLead = async (leadData) => {
  const response = await axios.post("/api/leads", leadData);
  return response.data;
};

export const updateLead = async (id, leadData) => {
  try {
    console.log("Updating lead with data:", leadData);
    const response = await axios.patch(`/api/leads/${id}`, leadData);
    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

export const deleteLead = async (leadId) => {
  const response = await axios.delete(`/api/leads/${leadId}`);
  return response.data;
};

export const updateCallResponse = async (leadId, callData) => {
  const response = await axios.patch(
    `/api/leads/${leadId}/call-response`,
    callData
  );
  return response.data;
};

export const getLeadStats = async () => {
  const response = await axios.get("/api/leads/stats");
  return response.data;
};
