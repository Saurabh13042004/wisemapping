const Comment = require("../models/Comment");
const Flowchart = require("../models/flowchart");

// Create a new comment
const createComment = async (req, res) => {
  const { flowchartId, text } = req.body;
  const userId = req.user.id;

  try {
    const comment = new Comment({
      flowchart: flowchartId,
      user: userId,
      text: text,
    });

    await comment.save();

    // Add the comment to the flowchart's comments array
    const flowchart = await Flowchart.findById(flowchartId);
    flowchart.comments.push(comment._id);
    await flowchart.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error creating comment", error });
  }
};

// Edit an existing comment
const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is the author of the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to edit this comment" });
    }

    // Update the comment text
    comment.text = text;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is the author of the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }
    // Remove the comment from the flowchart
    const flowchart = await Flowchart.findById(comment.flowchart);
    flowchart.comments.pull(commentId);
    await flowchart.save();

    // Delete the comment
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(500).json({ message: "Error deleting the comment from the database" });
    }

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};
