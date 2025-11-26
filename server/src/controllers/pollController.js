const Poll = require("../models/Poll");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// CREATE POLL
const createPoll = async (req, res) => {
  try {
    const { question } = req.body;
    let options = req.body.options;

    // If only one option, make it array
    if (!Array.isArray(options)) options = [options];

    if (!question || !options || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Question and at least 2 options are required",
      });
    }

    const pollData = {
      question,
      options: options.map((opt) => ({ text: opt })),
      createdBy: req.user.id,
    };

    if (req.file) {
      pollData.image = req.file.filename;
    }

    // Create the poll
    const poll = await Poll.create(pollData);

    // ✅ Add poll ID to user's createdPolls
    const User = require("../models/User"); // ensure User model is imported
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdPolls: poll._id },
    });

    res.json({
      success: true,
      message: "Poll created successfully",
      poll,
    });
  } catch (error) {
    console.log("Create Poll Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// GET ALL POLLS
const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().populate("createdBy", "fullName email").sort({ createdAt: -1 });
    res.json({ success: true, polls });
  } catch (err) {
    console.log("Get All Polls Error:", err);
    res.status(500).json({ success: false });
  }
};

// GET MY POLLS
const getMyPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, polls });
  } catch (err) {
    console.log("Get My Polls Error:", err);
    res.status(500).json({ success: false });
  }
};

// SHIP POLL
const shipPoll = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) return res.status(404).json({ success: false, message: "Poll not found" });

    if (poll.shippedTo && poll.shippedTo.includes(toUserId)) {
      return res.json({ success: false, message: "Already shipped to this user" });
    }

    poll.shippedTo = poll.shippedTo || [];
    poll.shippedTo.push(toUserId);
    await poll.save();

    res.json({ success: true, message: "Poll shipped successfully" });
  } catch (err) {
    console.log("Ship Poll Error:", err);
    res.status(500).json({ success: false });
  }
};

const voteOption = async (req, res) => {
  try {
    const { pollId, index } = req.params;
    const optionIndex = Number(index);
    const userId = req.user?.id;

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ success: false, message: "Poll not found" });
    }

    if (!poll.votedBy) poll.votedBy = [];

    // FIXED: Correct duplicate vote check
    if (poll.votedBy.some(v => v.userId.toString() === userId)) {
      return res.status(400).json({ success: false, message: "User already voted" });
    }

    if (!poll.options[optionIndex]) {
      return res.status(400).json({ success: false, message: "Invalid option index" });
    }

    poll.options[optionIndex].votes += 1;

    // store what user voted
    poll.votedBy.push({ userId, optionIndex });

    await poll.save();

    const updatedPoll = await Poll.findById(pollId)
      .populate("createdBy", "fullName profileImage");

    res.status(200).json({ success: true, poll: updatedPoll });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- LIKE / UNLIKE POLL ----

// ---- LIKE / UNLIKE ----
// ---- LIKE / UNLIKE ----
const likePoll = async (req, res) => {
  try {
    const userId = req.user.id;
    const pollId = req.params.pollId;
    const poll = await Poll.findById(pollId);

    if (!poll) return res.status(404).json({ success: false, message: "Poll not found" });

    const index = poll.likedBy.findIndex(u => u.toString() === userId);
    const User = require("../models/User");

    if (index === -1) {
      // User likes the poll
      poll.likedBy.push(userId);
      await User.findByIdAndUpdate(userId, { $addToSet: { likedPolls: pollId } });
    } else {
      // User unlikes the poll
      poll.likedBy.splice(index, 1);
      await User.findByIdAndUpdate(userId, { $pull: { likedPolls: pollId } });
    }

    await poll.save();

    const updatedPoll = await Poll.findById(pollId)
      .populate("createdBy", "fullName profileImage")
      .populate("votedBy.userId", "fullName profileImage")
      .populate("likedBy", "fullName profileImage");

    res.json({ success: true, poll: updatedPoll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = {
  createPoll,
  getAllPolls,
  getMyPolls,
  shipPoll,
  voteOption,
  likePoll,
  upload,
};
