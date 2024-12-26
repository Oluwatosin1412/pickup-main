const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const wasteSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Waste = mongoose.model("Waste", wasteSchema);

module.exports = Waste;