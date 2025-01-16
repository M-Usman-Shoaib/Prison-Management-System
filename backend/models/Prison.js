const mongoose = require("mongoose");

const PrisonSchema = new mongoose.Schema({
  prisonID: {
    type: String,
    required: true,
    unique: true, // Ensure prisonID is unique
  },
  location: {
    type: String,
    required: true,
  },
  cellBlocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cell",
    },
  ],
  capacity: {
    type: Number,
    required: true,
  },
  securityLevel: {
    type: String,
    enum: ["Low", "Medium", "High", "Maximum"], // Security levels
    required: true,
  },
});

const Prison = mongoose.model("Prison", PrisonSchema);

module.exports = Prison;
