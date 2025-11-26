const express = require("express");
const {getStats,getLatestPolls} = require("../controllers/DashController");
const { authMiddleware } = require("../middleware/authMiddleware"); // ✅ import
const router = express.Router();

router.get("/stats", getStats);
// GET /admin/latest-polls
router.get("/latest-polls", authMiddleware , async (req, res) => {
  try {
    const polls = await getLatestPolls();
    res.json(polls);
  } catch (err) {   
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
