const express = require("express");
const { createWasteRequest, getUserWastes } = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/wastes", authenticate, authorize(["user"]), createWasteRequest);
router.get("/wastes", authenticate, authorize(["user"]), getUserWastes);

module.exports = router;