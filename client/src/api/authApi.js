import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// REGISTER
export const registerUser = (data) => API.post("/register", data);

// LOGIN
export const loginUser = (data) => API.post("/login", data);

// GOOGLE LOGIN
export const googleLogin = (credential) =>
  API.post("/google-login", { credential });
