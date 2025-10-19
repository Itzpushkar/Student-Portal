import apiClient from "./apiClient";

// Signup
export const signup = async (data) => {
  return await apiClient.post("/auth/signup", data);
};

// Verify OTP
export const verifyOtp = async (data) => {
  return await apiClient.post("/auth/verify-otp", data);
};

// Login
export const login = async (data) => {
  return await apiClient.post("/auth/login", data);
};
