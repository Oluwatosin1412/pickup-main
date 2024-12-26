const Waste = require("../models/Waste");

const getWastes = async (req, res) => {
  try {
    const wastes = await Waste.find();
    res.json(wastes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addWaste = async (req, res) => {
  const { type, description } = req.body;

  try {
    const waste = new Waste({ type, description });
    await waste.save();
    res.status(201).json(waste);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getWastes, addWaste };