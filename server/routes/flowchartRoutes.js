const express = require("express");
const router = express.Router();
const {
  createFlowchart,
  getFlowcharts,
  getFlowchartById,
  updateFlowchart,
  deleteFlowchart,
} = require("../controllers/flowchartController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createFlowchart);

router.get("/", protect, getFlowcharts);

router.get("/:id", protect, getFlowchartById);

router.put("/:id", protect, updateFlowchart);

router.delete("/:id", protect, deleteFlowchart);

module.exports = router;
