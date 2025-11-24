import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

// Protected
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Pages
import DashboardPage from "./pages/Dashboard";
import FeedPage from "./pages/Feed";
import ProfilePage from "./pages/Profile";
import CreatePollPage from "./pages/CreatePoll";

// Layout
import Navbar from "./components/Layout/Navbar";

const App = () => {
  const token = localStorage.getItem("token"); // check login on page load

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default → if logged in → /app/dashboard, else → /login */}
          <Route
            path="/"
            element={token ? <Navigate to="/app/dashboard" /> : <Navigate to="/login" />}
          />

          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/app" element={<ProtectedRoute />}>
            {/* Layout */}
            <Route element={<Navbar />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="feed" element={<FeedPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="create" element={<CreatePollPage />} />
            </Route>
          </Route>

          {/* Unknown → login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
