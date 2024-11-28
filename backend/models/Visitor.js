const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true, // Full name of the visitor
    },
    relationshipToInmate: {
        type: String,
        required: true, // Relationship (e.g., "spouse", "friend", "family")
    },
    phone: {
        type: String, // Phone number of the visitor
    },

    inmate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inmate", // Reference to Inmate model
        required: true, // Inmate whom the visitor is visiting
    },
    visitDate: {
        type: Date,
        required: true, // Date of the visit
    },
});

const Visitor = mongoose.model("Visitor", VisitorSchema);

module.exports = Visitor;
