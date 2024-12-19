const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, (req, res) => {
    if (req.user) {
      return res.json({ isValid: true });
    } else {
      return res.status(401).json({ isValid: false, message: "Token is invalid" });
    }
  });

module.exports = router;
