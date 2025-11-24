// src/context/AuthContext.jsx
import { createContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { loginUser, registerUser, googleLogin } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem("token") || null);
  const [profileData, setProfileData] = useState(null);
  const API = "http://localhost:5000/api";

  // --------------------------
  // REGISTER
  // --------------------------
  const handleRegister = async (fullName, email, password) => {
    const res = await registerUser({ fullName, email, password });
    return res.data;
  };

  // --------------------------
  // LOGIN
  // --------------------------
  const handleLogin = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      setUserToken(res.data.token);
      await fetchProfile(res.data.token);
    }
    return res.data;
  };

  // --------------------------
  // GOOGLE LOGIN
  // --------------------------
  const handleGoogleLogin = async (credential) => {
    const res = await googleLogin(credential);
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      setUserToken(res.data.token);
      await fetchProfile(res.data.token);
    }
    return res.data;
  };

  // --------------------------
  // LOGOUT
  // --------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserToken(null);
    setProfileData(null);
  };

  // --------------------------
  // FETCH PROFILE
  // --------------------------
  const fetchProfile = useCallback(async (token) => {
    if (!token) return;
    try {
      const res = await axios.get(`${API}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }, []);

  useEffect(() => {
    if (userToken) fetchProfile(userToken);
  }, [userToken, fetchProfile]);

  // =====================================================
  //               🟢 POLL FUNCTIONS
  // =====================================================

  // CREATE POLL
  const createPoll = async (formData) => {
    try {
      const res = await axios.post(`${API}/polls/create`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      console.error("Create poll error:", err);
      return { success: false, message: err.response?.data?.message || "Server Error" };
    }
  };

  // GET ALL POLLS
  const getAllPolls = async () => {
    try {
      const res = await axios.get(`${API}/polls`);
      return res.data;
    } catch (err) {
      console.error("Get all polls error:", err);
      return { polls: [] };
    }
  };

  // GET MY POLLS
  const getMyPolls = async () => {
    try {
      const res = await axios.get(`${API}/polls/my`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      return res.data;
    } catch (err) {
      console.error("Get my polls error:", err);
      return { polls: [] };
    }
  };

  // SHIP POLL
  const shipPoll = async (pollId, toUserId) => {
    try {
      const res = await axios.post(
        `${API}/polls/ship/${pollId}`,
        { toUserId },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      return res.data;
    } catch (err) {
      console.error("Ship poll error:", err);
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        profileData,
        handleRegister,
        handleLogin,
        handleGoogleLogin,
        handleLogout,
        fetchProfile,

        // Poll functions
        createPoll,
        getAllPolls,
        getMyPolls,
        shipPoll,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
