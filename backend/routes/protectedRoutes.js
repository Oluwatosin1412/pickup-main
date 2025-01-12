const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route" });
});

module.exports = router;
