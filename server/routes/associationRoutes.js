const express = require("express");
const router = express.Router();
const {
  shareFlowchart,
  getSharedUsers,
  updatePermission,
  removeAccess,
} = require("../controllers/associationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/:flowchartId/share", protect, shareFlowchart);

router.get("/:flowchartId/users", protect, getSharedUsers);

router.put("/:flowchartId/permissions/:userId", protect, updatePermission);

router.delete("/:flowchartId/permissions/:userId", protect, removeAccess);

module.exports = router;
