import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
});

// REGISTER
export const registerUser = (data) => API.post("/register", data);

// LOGIN
export const loginUser = (data) => API.post("/login", data);

// GOOGLE LOGIN
export const googleLogin = (credential) =>
  API.post("/google-login", { credential });
