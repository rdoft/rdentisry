import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;