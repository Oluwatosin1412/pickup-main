const Waste = require("../models/Waste");

const getWastes = async (req, res) => {
  try {
    const wastes = await Waste.find();
    res.json(wastes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateWasteStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const waste = await Waste.findByIdAndUpdate(id, { status }, { new: true });
    if (!waste) return res.status(404).json({ message: "Waste not found" });
    res.json(waste);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getWastes, updateWasteStatus };