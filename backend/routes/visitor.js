const express = require("express");
const Visitor = require("../models/Visitor");
const Inmate = require("../models/Inmate");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const router = express.Router();

// Add a new Visitor
router.post(
    "/add",
    passport.authenticate("jwt", { session: false }),
    [
        check("fullName", "Visitor's full name is required").not().isEmpty(),
        check("relationshipToInmate", "Relationship to inmate is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullName, relationshipToInmate, phone} = req.body;

        try {
            const newVisitor = new Visitor({
                fullName,
                relationshipToInmate,
                phone,
            });

            await newVisitor.save();
            res.json(newVisitor);
        } catch (error) {
            res.status(500).send("Server Error");
        }
    }
);

// List all Visitors
router.get(
    "/getAll",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const visitors = await Visitor.find().populate("visitHistory.inmate"); // Populate inmate information in visit history
            res.json(visitors);
        } catch (error) {
            res.status(500).send("Server Error");
        }
    }
);

// View a Visitor's Details
router.get(
    "/visitor/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const visitor = await Visitor.findById(req.params.id).populate("visitHistory.inmate");
            if (!visitor) {
                return res.status(404).json({ msg: "Visitor not found" });
            }
            res.json(visitor);
        } catch (error) {
            res.status(500).send("Server Error");
        }
    }
);

// Edit Visitor Details
router.put(
    "/visitor/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { fullName, relationshipToInmate, contactInfo, visitorPrivileges } = req.body;
        
        const visitorFields = {};
        if (fullName) visitorFields.fullName = fullName;
        if (relationshipToInmate) visitorFields.relationshipToInmate = relationshipToInmate;
        if (contactInfo) visitorFields.contactInfo = contactInfo;
        if (visitorPrivileges) visitorFields.visitorPrivileges = visitorPrivileges;

        try {
            let visitor = await Visitor.findById(req.params.id);
            if (!visitor) {
                return res.status(404).json({ msg: "Visitor not found" });
            }

            visitor = await Visitor.findByIdAndUpdate(
                req.params.id,
                { $set: visitorFields },
                { new: true }
            );

            res.json(visitor);
        } catch (error) {
            res.status(500).send("Server Error");
        }
    }
);

// Add a Visit to a Visitor's History
router.post(
    "/visitor/:id/visit",
    passport.authenticate("jwt", { session: false }),
    [
        check("inmateId", "Inmate ID is required").not().isEmpty(),
        check("visitStatus", "Visit status is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { inmateId, visitStatus, notes } = req.body;

        try {
            let visitor = await Visitor.findById(req.params.id);
            if (!visitor) {
                return res.status(404).json({ msg: "Visitor not found" });
            }

            let inmate = await Inmate.findById(inmateId);
            if (!inmate) {
                return res.status(404).json({ msg: "Inmate not found" });
            }

            visitor.visitHistory.push({ date: new Date(), inmate: inmateId, visitStatus, notes });
            await visitor.save();

            res.json(visitor);
        } catch (error) {
            res.status(500).send("Server Error");
        }
    }
);

// Delete a Visitor's Information
router.delete(
    "/visitor/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            let visitor = await Visitor.findById(req.params.id);
            if (!visitor) {
                return res.status(404).json({ msg: "Visitor not found" });
            }

            await Visitor.findByIdAndRemove(req.params.id);
            res.json({ msg: "Visitor record deleted" });
        } catch (error) {
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;
