const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  flowchart: { type: mongoose.Schema.Types.ObjectId, ref: "Flowchart", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);