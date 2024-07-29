import axios from "axios";
import { handleError } from "utils";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://localhost:8080/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

// Response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(handleError(error));
  }
);

export default instance;
