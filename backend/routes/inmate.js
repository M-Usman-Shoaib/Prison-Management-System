const express = require("express");
const Inmate = require("../models/Inmate");
const Crime = require("../models/Crime");
const Cell = require("../models/Cell");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const router = express.Router();

// Create a new inmate
router.post(
    "/add",
    passport.authenticate("jwt", { session: false }),
    [
        check("inmateId", "Inmate ID is required").not().isEmpty(),
        check("fullName", "Full name is required").not().isEmpty(),
        check("dateOfBirth", "Date of birth is required").not().isEmpty(),
        check("cellBlock", "CellBlock ID is required").not().isEmpty(),
        check("crimeCommitted", "Crimes committed are required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

       
        const { inmateId, fullName, dateOfBirth, crimeCommitted, cellBlock, medicalHistory } = req.body;

         // Check if prison with the same prisonID already exists
         let existingInmate = await Inmate.findOne({ inmateId });
         if (existingInmate) {
             return res.status(400).json({ msg: "Inmate with this ID already exists" });
         }

        try {
            // Check if CellBlock exists
            const cellBlockExists = await Cell.findById(cellBlock);
            if (!cellBlockExists) {
                return res.status(404).json({ msg: "CellBlock not found" });
            }

            // Check if the crimes committed exist
            const crime = await Crime.findById(crimeCommitted);
            if (!crime) {
                return res.status(404).json({ msg: "One or more crimes not found" });
            }

            // Check if the inmate ID already exists
            const existingInmate = await Inmate.findOne({ inmateId });
            if (existingInmate) {
                return res.status(400).json({ msg: "Inmate ID already exists" });
            }

            const inmate = new Inmate({
                inmateId,
                fullName,
                dateOfBirth,
                crimeCommitted,
                cellBlock,
                medicalHistory,
            });

            await inmate.save();

            await Cell.findByIdAndUpdate
            (
                cellBlock,
                {
                    $push: { inmates: inmate._id },
                }
            );
            


            res.json(inmate);
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }
);

// Get all inmates
router.get(
    "/getAll",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const inmates = await Inmate.find().populate("crimeCommitted cellBlock");
            res.json(inmates);
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }
);

// Get a single inmate by ID
router.get(
    "/get/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const inmate = await Inmate.findById(req.params.id).populate("crimeCommitted cellBlock");
            if (!inmate) {
                return res.status(404).json({ msg: "Inmate not found" });
            }
            res.json(inmate);
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }
);

// Update an inmate's details
router.put(
    "/update/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { inmateId, dateOfBirth, crimeCommitted, cellBlock, medicalHistory } = req.body;

        const inmateFields = {};
        if (inmateId) inmateFields.inmateId = inmateId;
        if (dateOfBirth) inmateFields.dateOfBirth = dateOfBirth;
        if (crimeCommitted) inmateFields.crimeCommitted = crimeCommitted;
        if (cellBlock) inmateFields.cellBlock = cellBlock;
        if (medicalHistory) inmateFields.medicalHistory = medicalHistory;

        // Check if CellBlock exists
        const cellBlockExists = await Cell.findById(cellBlock);
        if (!cellBlockExists) {
            return res.status(404).json({ msg: "CellBlock not found" });
        }

        // Check if the crimes committed exist
        const crime = await Crime.findById(crimeCommitted);
        if (!crime) {
            return res.status(404).json({ msg: "One or more crimes not found" });
        }

        try {
            let inmate = await Inmate.findById(req.params.id);
            if (!inmate) {
                return res.status(404).json({ msg: "Inmate not found" });
            }

            inmate = await Inmate.findByIdAndUpdate(
                req.params.id,
                { $set: inmateFields },
                { new: true }
            );

            res.json(inmate);
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }
);

// Delete an inmate
router.delete(
    "/delete/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            let inmate = await Inmate.findById(req.params.id);
            if (!inmate) {
                return res.status(404).json({ msg: "Inmate not found" });
            }

            // If you also want to remove references to the inmate in related models, like CellBlock, do that here if needed
            await inmate.remove();
            res.json({ msg: "Inmate removed" });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;
