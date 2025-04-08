import axios from "../utils/axios";

export const getLeads = async () => {
  const response = await axios.get("/leads");
  return response.data;
};

export const addLead = async (leadData) => {
  const response = await axios.post("/leads", leadData);
  return response.data;
};

export const updateLead = async (id, leadData) => {
  try {
    const response = await axios.patch(`/leads/${id}`, leadData);

    return response.data;
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

export const deleteLead = async (leadId) => {
  const response = await axios.delete(`/leads/${leadId}`);
  return response.data;
};

export const updateCallResponse = async (leadId, callData) => {
  const response = await axios.patch(
    `/leads/${leadId}/call-response`,
    callData
  );
  return response.data;
};

export const getLeadStats = async () => {
  const response = await axios.get("/leads/stats");
  return response.data;
};

export const getTelecallers = async () => {
  const response = await axios.get("/users/telecallers");
  return response.data;
};

export const getTelecallerActivities = async (telecallerId) => {
  const response = await axios.get(
    `/users/telecallers/${telecallerId}/activities`
  );
  return response.data;
};
