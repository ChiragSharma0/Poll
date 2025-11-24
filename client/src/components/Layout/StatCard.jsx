import { FaUsers, FaPoll, FaVoteYea } from "react-icons/fa";

export default function StatCard({ title, value, icon, color = "bg-blue-500" }) {
  // Default icon based on title
  const defaultIcon = () => {
    if (icon) return icon;
    if (title.toLowerCase().includes("user")) return <FaUsers size={32} />;
    if (title.toLowerCase().includes("poll")) return <FaPoll size={32} />;
    if (title.toLowerCase().includes("vote")) return <FaVoteYea size={32} />;
    return null;
  };

  return (
    <div className={`flex items-center gap-4 p-6 rounded-2xl shadow-md text-white ${color} transition transform hover:scale-105`}>
      <div>{defaultIcon()}</div>
      <div className="flex flex-col">
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}
