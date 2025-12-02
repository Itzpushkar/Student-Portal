import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // Points to your backend
  withCredentials: true, // Important for handling cookies/sessions
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
