const express = require("express");
const Prison = require("../models/Prison");
const Cell = require("../models/Cell");
const Inmate = require("../models/Inmate");
const pino = require("pino")();
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const router = express.Router();

// Create a new prison
router.post(
    "/add",
    [
        check("prisonID", "ID is required").not().isEmpty(),
        check("location", "Location is required").not().isEmpty(),
        check("capacity", "Capacity is required").isNumeric(),
        check("securityLevel", "Security level is required").isIn(["Low", "Medium", "High", "Maximum"]),
    ],

    passport.authenticate("jwt", { session: false }),

    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { prisonID, location, capacity, securityLevel } = req.body;

        try {

            // Check if prison with the same prisonID already exists
            let existingPrison = await Prison.findOne({ prisonID });
            if (existingPrison) {
                return res.status(400).json({ msg: "Prison with this ID already exists" });
            }

            const prison = new Prison({
                prisonID,
                location,
                capacity,
                securityLevel,
            });

            await prison.save();
            res.json(prison);
        } catch (error) {
            pino.error(error);
            res.status(500).send("Server Error");
        }
    }
);

// Get all prisons
router.get(
    "/getAll",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const prisons = await Prison.find().populate("cellBlocks");
            res.json(prisons);
        } catch (error) {
            pino.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// Get a single prison and its cells
router.get("/get/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            // Find the prison by ID and populate its cellBlocks
            const prison = await Prison.findById(req.params.id).populate('cellBlocks');
            
            if (!prison) {
                return res.status(404).json({ msg: "Prison not found" });
            }

            // Add cells to the response
            res.json(prison);
        } catch (error) {
            pino.error(error);
            res.status(500).send("Server Error");
        }
    }
);


// Update a prison
router.put("/update/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {

        const { prisonID, location, capacity, securityLevel } = req.body;

        const prisonFields = {};
        if (prisonID) prisonFields.prisonID = prisonID;
        if (location) prisonFields.location = location;
        if (capacity) prisonFields.capacity = capacity;
        if (securityLevel) prisonFields.securityLevel = securityLevel;

        try {
            let prison = await Prison.findById(req.params.id);
            if (!prison) {
                return res.status(404).json({ msg: "Prison not found" });
            }

            if (prisonID) {
                const existingPrison = await Prison.findOne({ prisonID });
                if (existingPrison && existingPrison.id !== req.params.id) {
                    return res.status(400).json({ msg: "Prison ID already exists" });
                }
            }

            prison = await Prison.findByIdAndUpdate(
                req.params.id,
                { $set: prisonFields },
                { new: true }
            );

            res.json(prison);
        } catch (error) {
            pino.error(error);
            res.status(500).send("Server Error");
        }
    }
);

// Delete a prison
router.delete("/delete/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {

            // // Check if the user is authenticated and has the role of 'admin'
            // if (!req.session.user || req.session.user.role !== 'admin') {
            //     return res.status(401).json({ error: "Unauthorized" });
            // }

            const prison = await Prison.findById(req.params.id);
            if (!prison) {
                return res.status(404).json({ msg: "Prison not found" });
            }

            // Find all cell blocks associated with this prison
            const cellBlocks = await CellBlock.find({ prisonID: req.params.id });

            // Delete all inmates within each cell block
            for (const cellBlock of cellBlocks) {
                await Inmate.deleteMany({ cellBlock: cellBlock._id });
            }

            // Delete all cell blocks associated with the prison
            await CellBlock.deleteMany({ prison: req.params.id });

            await Prison.deleteOne({ _id: req.params.id });

            res.json({ msg: "Prison and all associated records removed" });
        } catch (error) {
            pino.error(error);
            res.status(500).send("Server Error");
        }
    }
);


module.exports = router;
