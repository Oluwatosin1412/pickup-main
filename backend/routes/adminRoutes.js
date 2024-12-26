const express = require("express");
const { getWastes, addWaste } = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/wastes", authenticate, authorize(["admin", "superadmin"]), getWastes);
router.post("/wastes", authenticate, authorize(["admin", "superadmin"]), addWaste);

module.exports = router;