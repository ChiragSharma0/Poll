import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { userToken } = useContext(AuthContext);
  const token = userToken || localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />; // Yaha Outlet important hai for nested routes
};

export default ProtectedRoute;
