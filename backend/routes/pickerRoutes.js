const express = require("express");
const { getWastes, updateWasteStatus } = require("../controllers/pickerController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/wastes", authenticate, authorize(["picker"]), getWastes);
router.put("/wastes/:id", authenticate, authorize(["picker"]), updateWasteStatus);

module.exports = router;