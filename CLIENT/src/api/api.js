import axios from "axios";

const API = axios.create({
  baseURL: "https://fundraiser-system.onrender.com/api",
  withCredentials: true, // Send cookies
});

export default API;
