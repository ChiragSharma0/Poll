const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createPoll,
  getAllPolls,
  getMyPolls,
  shipPoll,
  voteOption,
  likePoll,
  deletePoll,
  upload,
} = require("../controllers/pollController");

// CREATE POLL with image upload
router.post("/create", authMiddleware, upload.single("image"), createPoll);

// GET ALL POLLS
router.get("/all", getAllPolls);

// GET MY POLLS (Only logged-in user)
router.get("/my", authMiddleware, getMyPolls);

// SHIP POLL
router.post("/ship/:pollId", authMiddleware, shipPoll);
router.post("/Vote/:pollId/option/:index",authMiddleware,voteOption);
router.post("/like/:pollId", authMiddleware, likePoll);
router.post("/delete/:pollId",authMiddleware,deletePoll);
module.exports = router;
