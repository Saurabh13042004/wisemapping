const Association = require("../models/association");
const User = require("../models/user");

const shareFlowchart = async (req, res) => {
  const { flowchartId } = req.params;
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: "Email and role are required." });
  }

  try {
    const ownerAssociation = await Association.findOne({
      user: req.user.id,
      flowchart: flowchartId,
      role: "owner",
    });

    if (!ownerAssociation) {
      return res.status(403).json({ message: "Only the owner can share this flowchart." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with the given email." });
    }

    const existingAssociation = await Association.findOne({ user: user._id, flowchart: flowchartId });
    if (existingAssociation) {
      return res.status(400).json({ message: "User already has access to this flowchart." });
    }

    const newAssociation = await Association.create({
      user: user._id,
      flowchart: flowchartId,
      role,
    });

    res.status(201).json({ message: "Flowchart shared successfully.", association: newAssociation });
  } catch (error) {
    res.status(500).json({ message: "Failed to share flowchart", error: error.message });
  }
};

const getSharedUsers = async (req, res) => {
  const { flowchartId } = req.params;

  try {
    const associations = await Association.find({ flowchart: flowchartId }).populate("user", "name email");

    res.status(200).json(associations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch shared users", error: error.message });
  }
};

const updatePermission = async (req, res) => {
  const { flowchartId, userId } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: "Role is required." });
  }

  try {
    const ownerAssociation = await Association.findOne({
      user: req.user.id,
      flowchart: flowchartId,
      role: "owner",
    });

    if (!ownerAssociation) {
      return res.status(403).json({ message: "Only the owner can update permissions." });
    }

    const updatedAssociation = await Association.findOneAndUpdate(
      { user: userId, flowchart: flowchartId },
      { role },
      { new: true }
    );

    if (!updatedAssociation) {
      return res.status(404).json({ message: "User does not have access to this flowchart." });
    }

    res.status(200).json({ message: "Role updated successfully.", association: updatedAssociation });
  } catch (error) {
    res.status(500).json({ message: "Failed to update permissions", error: error.message });
  }
};

const removeAccess = async (req, res) => {
  const { flowchartId, userId } = req.params;

  try {
    const ownerAssociation = await Association.findOne({
      user: req.user.id,
      flowchart: flowchartId,
      role: "owner",
    });

    if (!ownerAssociation) {
      return res.status(403).json({ message: "Only the owner can remove access." });
    }

    const removedAssociation = await Association.findOneAndDelete({ user: userId, flowchart: flowchartId });

    if (!removedAssociation) {
      return res.status(404).json({ message: "User does not have access to this flowchart." });
    }

    res.status(200).json({ message: "Access removed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove access", error: error.message });
  }
};

module.exports = {
  shareFlowchart,
  getSharedUsers,
  updatePermission,
  removeAccess,
};
