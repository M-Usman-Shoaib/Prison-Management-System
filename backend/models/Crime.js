const mongoose = require("mongoose");

const CrimeSchema = new mongoose.Schema({
    nature: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        enum: ["Low", "Medium", "High", "Severe"],
        required: true,
    },
    legalReferences: {
        type: String,
        required: true, // This can be a reference to legal codes or regulations.
    },
    description: {
        type: String,
        required: true,
    },
    evidence: {
        type: String, // URL or reference to the evidence related to the crime.
        required: false,
    },
    connectedInmates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inmate", // Reference to Inmate model
    }],
});

const Crime = mongoose.model("Crime", CrimeSchema);

module.exports = Crime;
