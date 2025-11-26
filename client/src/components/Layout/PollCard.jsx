import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";

export default function PollCard({ poll, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pollData, setPollData] = useState(poll);
  const [hasVoted, setHasVoted] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const { profileData } = useContext(AuthContext);
  const loggedUserId = profileData?.userId;
  const API = import.meta.env.VITE_API_URL;

  // Sync poll updates
  useEffect(() => {
    setPollData(poll);
  }, [poll]);

  // Detect vote and like status
  useEffect(() => {
    if (!loggedUserId || !pollData) return;

    setHasVoted(
      pollData.votedBy?.some(
        v =>
          (v.userId?._id?.toString() === loggedUserId) ||
          (v.userId?.toString() === loggedUserId)
      )
    );

    setHasLiked(
      pollData.likedBy?.some(
        u =>
          (u._id?.toString() === loggedUserId) ||
          (u.toString() === loggedUserId)
      )
    );
  }, [pollData, loggedUserId]);

  if (!pollData) return null;

  const userName = pollData.createdBy?.fullName || "Unknown User";
  const userAvatar =
    pollData.createdBy?.profileImage ||
    `https://ui-avatars.com/api/?name=${userName.charAt(0)}&background=random`;

  // ---- VOTE HANDLER ----
  const handleVote = async index => {
    try {
      const { data } = await axios.post(
        `${API}/polls/vote/${pollData._id}/option/${index}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setPollData(data.poll);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // ---- LIKE HANDLER ----
  const handleLike = async () => {
    try {
      const { data } = await axios.post(
        `${API}/polls/like/${pollData._id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setPollData(data.poll);
    } catch (err) {
      console.log("Like error:", err);
    }
  };

  // ---- DELETE HANDLER ----
  const handleDelete = async () => {
  try {
    await axios.post(`${API}/polls/delete/${pollData._id}`, {}, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

    onDelete(pollData._id);
    setMenuOpen(false);
  } catch (err) {
    console.log("Delete error:", err);
  }
};


  return (
    <div className="relative bg-white rounded-2xl shadow-lg p-4">
      {/* MENU FOR OWNER */}
      {pollData?.createdBy?._id === loggedUserId && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiMoreVertical size={20} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border z-50">
              <button
                onClick={handleDelete}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* USER INFO */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={userAvatar}
          alt={userName}
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <p className="font-semibold text-gray-800">{userName}</p>
          <p className="text-sm text-gray-500">
            {new Date(pollData.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* QUESTION */}
      <p className="text-gray-900 font-bold text-lg mb-4">{pollData.question}</p>

      {/* OPTIONS */}
      <div className="flex flex-col gap-3">
        {pollData.options.map((opt, i) => (
          <button
            key={i}
            disabled={hasVoted}
            onClick={() => handleVote(i)}
            className={`w-full flex justify-between items-center p-3 border rounded-xl transition font-medium ${
              hasVoted ? "bg-gray-200 cursor-not-allowed" : "hover:bg-blue-50"
            }`}
          >
            <span>{opt.text}</span>
            {hasVoted && <span className="font-semibold">{opt.votes}</span>}
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 font-semibold ${
            hasLiked ? "text-blue-600" : "text-gray-600"
          }`}
        >
          👍 {pollData.likedBy?.length || 0}
        </button>
        <button className="text-blue-600 font-semibold hover:underline">
          View
        </button>
      </div>
    </div>
  );
}
