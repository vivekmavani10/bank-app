import axios from "axios";

const axiosFormInstance = axios.create({
  baseURL: "http://localhost:4000/api",
});

axiosFormInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosFormInstance;
