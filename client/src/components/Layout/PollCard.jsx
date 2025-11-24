import { useState } from "react";
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";

export default function PollCard({ poll, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const userName = poll.createdBy?.fullName || "Unknown User";
  const userAvatar =
    poll.createdBy?.profileImage ||
    `https://ui-avatars.com/api/?name=${userName.charAt(0)}&background=random`;

  // logged in user id for owner check
  const loggedUserId = localStorage.getItem("userId");

  // DELETE POLL
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/polls/${poll._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      onDelete(poll._id); // remove from UI immediately
      setMenuOpen(false);
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden p-4">

      {/* THREE DOT MENU — ONLY OWNER */}
      {poll.createdBy?._id === loggedUserId && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiMoreVertical size={20} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border z-50 animate-fadeIn">
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
            {new Date(poll.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* QUESTION */}
      <p className="text-gray-900 font-bold text-lg md:text-xl mb-4">
        {poll.question}
      </p>

      {/* OPTIONS */}
      <div className="flex flex-col gap-3">
        {poll.options.map((opt, i) => (
          <button
            key={i}
            className="w-full text-left p-3 border border-gray-200 rounded-xl hover:bg-blue-50 transition font-medium text-gray-800"
          >
            {opt.text}
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
        <div className="flex items-center gap-3">
          <span>👍 {poll.likes || 0}</span>
          <span>💬 {poll.comments || 0}</span>
        </div>
        <button className="text-blue-600 font-semibold hover:underline">
          View
        </button>
      </div>
    </div>
  );
}
