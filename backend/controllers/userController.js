const Waste = require("../models/Waste");

const createWasteRequest = async (req, res) => {
  const { type, description } = req.body;

  try {
    const waste = new Waste({ type, description, user: req.user.id });
    await waste.save();
    res.status(201).json(waste);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUserWastes = async (req, res) => {
  try {
    const wastes = await Waste.find({ user: req.user.id });
    res.json(wastes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createWasteRequest, getUserWastes };