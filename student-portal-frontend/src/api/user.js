import apiClient from "./apiClient";

// Get user dashboard data
export const getDashboard = async (userId) => {
  return await apiClient.post("/user/dashboard", { userId });
};

// Save personal details
export const savePersonalDetails = async (data) => {
  return await apiClient.post("/user/personal", data);
};

// Submit academic details
export const submitAcademicDetails = async (data) => {
  return await apiClient.post("/user/academic", data);
};

// Select semester
export const selectSemester = async (data) => {
  return await apiClient.post("/user/select-semester", data);
};
