const Flowchart = require("../models/flowchart");
const Association = require("../models/association");

const createFlowchart = async (req, res) => {
  const { title, nodes, edges } = req.body;

  if (!title || !nodes || !edges) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const flowchart = await Flowchart.create({
      title,
      nodes,
      edges,
      owner: req.user.id,
    });

    await Association.create({
      user: req.user.id,
      flowchart: flowchart._id,
      role: "owner",
    });

    res.status(201).json(flowchart);
  } catch (error) {
    res.status(500).json({ message: "Failed to create flowchart", error: error.message });
  }
};

const getFlowcharts = async (req, res) => {
  try {
    const associations = await Association.find({ user: req.user.id })
    .populate({
      path: "flowchart",
      model: "Flowchart", // Ensure this matches your Flowchart model name
      populate: {
        path: "owner", // Populate the user field within the flowchart
        model: "User", // Ensure this matches your User model name
      },
    });

  // Map through associations to extract both flowchart and user data
  const flowcharts = associations.map((assoc) => ({
    flowchart: assoc.flowchart,
    user: assoc.flowchart.user, // Assuming user field exists in the Flowchart schema
  }));

  res.status(200).json(flowcharts);
} catch (error) {
  res.status(500).json({
    message: "Failed to fetch flowcharts",
    error: error.message,
  });
}
};

const getFlowchartById = async (req, res) => {
  const { id } = req.params;

  try {
    const association = await Association.findOne({
      user: req.user.id,
      flowchart: id,
    }).populate("flowchart");

    if (!association) {
      return res.status(403).json({ message: "Access denied to this flowchart" });
    }

    res.status(200).json(association.flowchart);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch flowchart", error: error.message });
  }
};

const updateFlowchart = async (req, res) => {
  const { id } = req.params;
  const { title, nodes, edges } = req.body;

  try {
    const association = await Association.findOne({
      user: req.user.id,
      flowchart: id,
      role: { $in: ["owner", "editor"] },
    });

    if (!association) {
      return res.status(403).json({ message: "You do not have permission to edit this flowchart" });
    }

    const updatedFlowchart = await Flowchart.findByIdAndUpdate(
      id,
      { title, nodes, edges, updatedAt: Date.now() },
      { new: true } 
    );

    res.status(200).json(updatedFlowchart);
  } catch (error) {
    res.status(500).json({ message: "Failed to update flowchart", error: error.message });
  }
};

const deleteFlowchart = async (req, res) => {
  const { id } = req.params;

  try {
    const association = await Association.findOne({
      user: req.user.id,
      flowchart: id,
      role: "owner",
    });

    if (!association) {
      return res.status(403).json({ message: "Only the owner can delete this flowchart" });
    }

    await Flowchart.findByIdAndDelete(id);
    await Association.deleteMany({ flowchart: id });

    res.status(200).json({ message: "Flowchart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete flowchart", error: error.message });
  }
};

module.exports = {
  createFlowchart,
  getFlowcharts,
  getFlowchartById,
  updateFlowchart,
  deleteFlowchart,
};
