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

    const poll = await Poll.create(pollData);

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

module.exports = {
  createPoll,
  getAllPolls,
  getMyPolls,
  shipPoll,
  upload, // export multer middleware
};
