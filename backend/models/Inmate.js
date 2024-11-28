const mongoose = require("mongoose");

const InmateSchema = new mongoose.Schema({
    inmateId: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    crimeCommitted: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Crime", // Reference to Crime model
        required: true,
    },
    cellBlock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cell", // Reference to the assigned CellBlock
        required: true,
    },
    medicalHistory: {
        type: String, // A summary of medical conditions and treatments
        required: false,
    },
});

const Inmate = mongoose.model("Inmate", InmateSchema);

module.exports = Inmate;
