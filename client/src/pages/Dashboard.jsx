import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import StatCard from "../components/Layout/StatCard";
import { FiRefreshCw, FiPlus } from "react-icons/fi";
import { FaUsers, FaPoll, FaVoteYea } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { userToken } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPolls: 0,
    totalVotes: 0,
  });

  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log("fetching dashboard")
      setStats({
        totalUsers: res.data.totalUsers,
        totalPolls: res.data.totalPolls,
        totalVotes: res.data.totalVotes,
      });
      console.log(stats);
    } catch (err) {
      console.error("Stats Error:", err);
    }
  };

  // Fetch Latest Polls
  const fetchLatestPolls = async () => {
  try {
    const { data } = await axios.get(`${API}/admin/latest-polls`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    if (!Array.isArray(data)) {
      console.warn("Expected an array of polls, got:", data);
      setLatest([]);
      return;
    }

    // Sort by createdAt descending (newest first)
    const sortedPolls = data
      .slice() // create a shallow copy to avoid mutating original
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setLatest(sortedPolls);
  } catch (err) {
    console.error("Failed to fetch latest polls:", err);
    setLatest([]);
  }
};

  // Initial Load
  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([fetchStats(), fetchLatestPolls()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  // Refresh button handler
  const handleRefresh = async () => {
    await Promise.all([fetchStats(), fetchLatestPolls()]);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-xl font-semibold text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">

      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-4xl md:text-4xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-500">
          Overview of your platform stats and recent activity.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          icon={<FaUsers size={32} className="text-white" />}
        />

        <StatCard
          title="Total Polls"
          value={stats.totalPolls}
          color="bg-gradient-to-r from-green-500 to-green-600"
          icon={<FaPoll size={32} className="text-white" />}
        />

        <StatCard
          title="Total Votes"
          value={stats.totalVotes}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          icon={<FaVoteYea size={32} className="text-white" />}
        />
      </div>

      {/* Create Poll Section */}
      <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create a New Poll
          </h2>
          <p className="text-gray-500 text-sm">
            Engage your users by publishing polls instantly.
          </p>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0">
          <button
            onClick={() => navigate("/app/create")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            <FiPlus /> Create Poll
          </button>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Latest Polls */}
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Latest Polls</h2>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>

        {latest.length === 0 ? (
          <div className="text-gray-400 text-center py-6">No polls found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((poll) => (
              <div
                key={poll._id}
                className="border rounded-2xl p-4 hover:shadow-lg hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="font-semibold text-gray-900 text-lg mb-2">
                  {poll.question}
                </div>

                {/* Correct Vote Count (backend field safe check) */}
                <div className="text-gray-500 text-sm">
                  Votes: {poll.totalVotes || poll.votes || poll.voteCount || 0}
                </div>

                <div className="text-gray-400 text-xs mt-1">
                  Created: {new Date(poll.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
