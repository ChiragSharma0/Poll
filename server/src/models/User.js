const mongoose = require("mongoose");
const generateAvatar = require("../helpers/generateAvatar");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
    },
    createdPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],
    likedPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],
  },
  {
    timestamps: true,
  }
);

// Auto-set avatar before save

module.exports = mongoose.model("User", userSchema);
