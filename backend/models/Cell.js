const mongoose = require("mongoose");

const CellSchema = new mongoose.Schema({
  cellID: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  securityLevel: {
    type: String,
    enum: ["Low", "Medium", "High", "Maximum"],
    required: true,
  },
  prison: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prison", // Reference to the Prison model
    required: true,
  },
  inmates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inmate", // Reference to Inmate model
  }],
});

const Cell = mongoose.model("Cell", CellSchema);

module.exports = Cell;
