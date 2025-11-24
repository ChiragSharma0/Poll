import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProfilePage() {
  const { userToken, profileData, fetchProfile } = useContext(AuthContext);

  // Avatar Generator
  const generateAvatar = (name) => {
    const firstLetter = name?.charAt(0)?.toUpperCase() || "U";
    const colors = ["FF6B6B", "4D96FF", "6BCB77", "FFD93D", "9D4EDD", "00A8E8"];
    const bg = colors[firstLetter.charCodeAt(0) % colors.length];
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=${bg}&color=fff&size=256&bold=true`;
  };

  useEffect(() => {
    if (userToken && !profileData) fetchProfile(userToken);
  }, [userToken, profileData, fetchProfile]);

  if (!profileData) return <div className="text-center py-10">Loading...</div>;

  const profilePic =
    !profileData.profileImage ||
    profileData.profileImage === "https://via.placeholder.com/150"
      ? generateAvatar(profileData.fullName)
      : profileData.profileImage;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">

      {/* PROFILE CARD */}
      <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border shadow">
          <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{profileData.fullName}</h1>
          <p className="text-gray-500 mt-1 text-sm">{profileData.email}</p>

          <div className="flex gap-10 mt-5">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {profileData.createdPolls?.length}
              </div>
              <p className="text-gray-500 text-sm">Created Polls</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {profileData.likedPolls?.length}
              </div>
              <p className="text-gray-500 text-sm">Liked Polls</p>
            </div>
          </div>
        </div>
      </div>

      {/* CREATED POLLS */}
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Created Polls</h2>

        {profileData.createdPolls.length === 0 ? (
          <div className="text-gray-400 text-center py-6">No polls created yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileData.createdPolls.map((poll) => (
              <div key={poll.id} className="border rounded-xl p-4 bg-gray-50 hover:shadow-lg transition">

                {/* Poll Image */}
                {poll.pollImage && (
                  <div className="w-full h-40 mb-3 rounded-lg overflow-hidden">
                    <img src={poll.pollImage} alt="Poll" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Question */}
                <h3 className="font-semibold text-lg text-gray-900">
                  {poll.question}
                </h3>

                {/* Options */}
                <div className="mt-2 space-y-1">
                  {poll.options?.map((opt, idx) => (
                    <p key={idx} className="text-sm text-gray-700">
                      <span className="font-semibold">Option {idx + 1}:</span> {opt}
                    </p>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-3 flex justify-between text-sm text-gray-500">
                  <span>Total Votes: {poll.votes}</span>
                  <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Status */}
                <div className="mt-2">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      poll.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {poll.isActive ? "Active" : "Closed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LIKED POLLS */}
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Liked Polls</h2>

        {profileData.likedPolls.length === 0 ? (
          <div className="text-gray-400 text-center py-6">No liked polls yet.</div>
        ) : (
          <div className="space-y-4">
            {profileData.likedPolls.map((poll) => (
              <div key={poll.id} className="border rounded-xl p-4 hover:shadow-md hover:bg-gray-50 transition">
                <h3 className="font-semibold text-gray-900">{poll.question}</h3>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Votes: {poll.votes}</span>
                  <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
