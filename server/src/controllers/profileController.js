const User = require("../models/User");
const Poll = require("../models/Poll");

const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "Invalid user request" });
    }

    const user = await User.findById(userId)
      .select("fullName email profileImage createdPolls likedPolls")
      .populate({
        path: "createdPolls",
        select: "question options votes createdAt pollImage",
      })
      .populate({
        path: "likedPolls",
        select: "question options votes createdAt pollImage",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format polls nicely
    const formatPoll = (poll) => ({
      id: poll._id,
      question: poll.question,
      votes: poll.votes?.length || 0,
      createdAt: poll.createdAt,
      pollImage: poll.pollImage || null,
      totalOptions: poll.options?.length || 0,
    });

    // 🟢 Add total counts
    const totalCreatedPolls = user.createdPolls?.length || 0;
    const totalLikedPolls = user.likedPolls?.length || 0;

    res.json({
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      userId,
      createdPolls: user.createdPolls?.map(formatPoll) || [],
      likedPolls: user.likedPolls?.map(formatPoll) || [],
      totalCreatedPolls,
      totalLikedPolls,
    });

  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProfile };
