const express = require("express");
const Cell = require("../models/Cell");
const Prison = require("../models/Prison");
const pino = require("pino")();
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const Inmate = require("../models/Inmate");
const router = express.Router();

// Create a new cell block
router.post(
    "/add",
    passport.authenticate("jwt", { session: false }),
    [
        check("cellID", "Cell ID is required").notEmpty(),
        check("capacity", "Capacity must be a number").isNumeric(),
        check("securityLevel", "Invalid security level").isIn(["Low", "Medium", "High", "Maximum"]),
        check("prison", "Invalid prison ID").isMongoId(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { cellID, capacity, securityLevel, prison } = req.body;

        // Check if prison with the same cellID already exists
        let existingCell = await Cell.findOne({ cellID: req.body.cellID });
        if (existingCell) {
            return res.status(400).json({ msg: "Cell ID already exists" });
        }

        // Check if the prison exists
        const prisonExist = await Prison.findById(prison);
        if (!prisonExist) {
            return res.status(404).json({ msg: "Prison not found" });
        }

        try {
            const cell = new Cell({
                cellID,
                capacity,
                securityLevel,
                prison, // Reference to the Prison ID
            });

            await cell.save();

            // Add the cell block ID to the corresponding prison's cellBlocks array
            await Prison.findByIdAndUpdate(prison, {
                $push: { cellBlocks: cell._id },
            });

            res.json(cell);
        } catch (error) {
            pino.error(error);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    }
);


// Get all cell blocks
router.get(
    "/getAll",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const cellBlocks = await Cell.find().populate("prison");
            res.json(cellBlocks);
        } catch (error) {
            pino.error(error);
            res.status(500).send("Server Error");
        }
    }
);

// Get a single cell block
router.get("/get/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const cellBlock = await Cell.findById(req.params.id).populate("prison");
            if (!cellBlock) {
                return res.status(404).json({ msg: "Cell Block not found" });
            }
            res.json(cellBlock);
        } catch (error) {
            pino.error(error);
            res.status(500).send("Server Error");
        }
    }
);

// Update a cell block
router.put("/update/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { cellID, capacity, securityLevel, prison } = req.body;


        const cellBlockFields = {};
        if (cellID) cellBlockFields.cellID = cellID;
        if (capacity) cellBlockFields.capacity = capacity;
        if (securityLevel) cellBlockFields.securityLevel = securityLevel;
        if (prison) cellBlockFields.prison = prison;

        // Check if the prison exists
        const prisonExist = await Prison.findById(prison);
        if (!prisonExist) {
            return res.status(404).json({ msg: "Prison not found" });
        }

        try {
            let cellBlock = await Cell.findById(req.params.id);
            if (!cellBlock) {
                return res.status(404).json({ msg: "Cell Block not found" });
            }

            if (cellID) {
                const existingCell = await Cell.findOne({ cellID });
                if (existingCell && existingCell.id !== req.params.id) {
                    return res.status(400).json({ msg: "Cell ID already exists" });
                }
            }

            // Update the cell block
            cellBlock = await Cell.findByIdAndUpdate(
                req.params.id,
                { $set: cellBlockFields },
                { new: true }
            );

            res.json(cellBlock);
        } catch (error) {
            pino.error(error);
            res.status(500).send("Server Error");
        }
    }
);

// Delete a cell block
router.delete("/delete/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const cellBlock = await Cell.findById(req.params.id);
            if (!cellBlock) {
                return res.status(404).json({ msg: "Cell Block not found" });
            }

            // Remove the cell block reference from the associated prison
            await Prison.findByIdAndUpdate(cellBlock.prison, {
                $pull: { cellBlocks: cellBlock._id },
            });

            // Delete all cell blocks associated with the prison
            await Inmate.deleteMany({ cellBlock: req.params.id });

            await Cell.deleteOne({ _id: req.params.id });
            res.json({ msg: "Cell Block removed" });
        } catch (error) {
            pino.error(error);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;
