import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

client.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("case_tracker_token") ||
    sessionStorage.getItem("case_tracker_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("case_tracker_token");
      localStorage.removeItem("case_tracker_user");

      sessionStorage.removeItem("case_tracker_token");
      sessionStorage.removeItem("case_tracker_user");
    }
    return Promise.reject(error);
  },
);

export default client;
