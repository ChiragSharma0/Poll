import { useEffect, useState } from "react";
import PollCard from "../components/Layout/PollCard";
import AdBox from "../components/Layout/AdsBox";
import axios from "axios";

export default function FeedPage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPolls = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/polls/all`);
      setPolls(res.data.polls || []);
    } catch (err) {
      console.log("Fetch Polls Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // Remove a poll from UI when deleted
  const handleDeletePoll = (pollId) => {
    setPolls((prev) => prev.filter((p) => p._id !== pollId));
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10 text-xl">Loading polls...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
        Explore Polls
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {polls.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No polls available.</div>
        ) : (
          polls.map((poll) => (
            <PollCard key={poll._id} poll={poll} onDelete={handleDeletePoll} />
          ))
        )}

        <div className="bg-white rounded-2xl shadow-md p-6 text-center text-gray-500 font-medium">
          <AdBox />
        </div>
      </div>
    </div>
  );
}
