import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
  withCredentials: true, // send cookies
});

export default apiClient;
