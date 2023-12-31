import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_AUTH_URL || "http://localhost:8080/auth/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

export default instance;
