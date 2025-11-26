const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  question: String,
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 },
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  shippedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  votedBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      optionIndex: Number
    },
  ],
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]


}, { timestamps: true });


module.exports = mongoose.model("Poll", pollSchema);
