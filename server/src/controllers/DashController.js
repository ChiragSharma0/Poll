const User = require("../models/User");
const Poll = require("../models/Poll");

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPolls = await Poll.countDocuments();

    // Count total votes across all polls
    const polls = await Poll.find({}, "options");
    let totalVotes = 0;

    polls.forEach((p) => {
      p.options.forEach((opt) => {
        totalVotes += opt.votes;
      });
    });

    res.json({
      success: true,
      totalUsers,
      totalPolls,
      totalVotes,
    });
console.log( totalUsers,
      totalPolls,
      totalVotes,)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Fetch latest polls (newest first)
const getLatestPolls = async () => {
  try {
    const polls = await Poll.find()
      .populate("createdBy", "fullName profileImage")
      .populate("votedBy.userId", "fullName profileImage")
      .populate("likedBy", "fullName profileImage")
      .sort({ createdAt: -1 }) // newest first
      .lean();

    // Optional: add totalVotes and totalLikes for convenience
    const formattedPolls = polls.map(poll => ({
      ...poll,
      totalVotes: poll.votedBy?.length || 0,
      totalLikes: poll.likedBy?.length || 0,
    }));

    return formattedPolls;
  } catch (err) {
    console.error("getLatestPolls error:", err);
    throw err;
  }
};


module.exports = { getStats ,getLatestPolls};
