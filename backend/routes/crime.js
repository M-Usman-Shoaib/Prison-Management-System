const express = require("express");
const Crime = require("../models/Crime");
const pino = require("pino")();
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const router = express.Router();

// Add New Crime
router.post(
    "/add",
    passport.authenticate("jwt", { session: false }),
    [
        check("nature", "Nature of the crime is required").not().isEmpty(),
        check("severity", "Severity is required").isIn(["Low", "Medium", "High", "Severe"]),
        check("legalReferences", "Legal references are required").not().isEmpty(),
        check("description", "Description is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nature, severity, legalReferences, description, evidence, status, connectedInmates } = req.body;

        try {
            const crime = new Crime({
                nature,
                severity,
                legalReferences,
                description,
                evidence,
                status,
            });

            await crime.save();
            res.json(crime);
        } catch (error) {
            pino.error(error);
            res.status(500).send("Server Error");
        }
    }
);

// List All Crimes
router.get(
    "/getAll",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const crimes = await Crime.find().populate("connectedInmates");
            res.json(crimes);
        } catch (error) {
            pino.error(error);
            res.status(500).send("Server Error");
        }
    }
);

// View Crime Details
router.get("/get/:id", 
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const crime = await Crime.findById(req.params.id).populate("connectedInmates");
            if (!crime) {
                return res.status(404).json({ msg: "Crime not found" });
            }
            res.json(crime);
        } catch (error) {
            pino.error(error);
            res.status(500).send("Server Error");
        }
    }
);

// Update Crime Details
router.put("/update/:id", 
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { nature, severity, legalReferences, description, evidence, status, connectedInmates } = req.body;

        const crimeFields = {};
        if (nature) crimeFields.nature = nature;
        if (severity) crimeFields.severity = severity;
        if (legalReferences) crimeFields.legalReferences = legalReferences;
        if (description) crimeFields.description = description;
        if (evidence) crimeFields.evidence = evidence;
        if (status) crimeFields.status = status;
        if (connectedInmates) crimeFields.connectedInmates = connectedInmates;

        try {
            let crime = await Crime.findById(req.params.id);
            if (!crime) {
                return res.status(404).json({ msg: "Crime not found" });
            }

            crime = await Crime.findByIdAndUpdate(
                req.params.id,
                { $set: crimeFields },
                { new: true }
            );

            res.json(crime);
        } catch (error) {
            pino.error(error);
            res.status(500).send("Server Error");
        }
    }
);

// Delete Crime
router.delete("/delete/:id", 
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const crime = await Crime.findById(req.params.id);
            if (!crime) {
                return res.status(404).json({ msg: "Crime not found" });
            }

            await Crime.deleteOne({ _id: req.params.id });
            res.json({ msg: "Crime removed" });
        } catch (error) {
            pino.error(error);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;
