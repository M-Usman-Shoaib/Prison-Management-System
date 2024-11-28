const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const passport = require("passport");
// Import the getToken function from the "helpers" module in the "utilities" directory
const { getToken } = require("../utilities/helpers");

const router = express.Router();

// Authentication middleware to ensure user is logged in
const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ msg: "Not authenticated" });
    }
    next();
};

// 1. Register (Create a New User)
router.post(
    "/register",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({ min: 0 }),
        check("role", "Role is required").isIn(["Admin", "Wardon"]),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, gender, role } = req.body;

        try {
            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: "User already exists" });
            }

            // Create a new user
            user = new User({
                name,
                email,
                password,
                gender,
                role,
            });

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();
            req.session.user = { email: user.email, role: user.role };
            res.status(201).json({ msg: "User created successfully", user });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

// 2. Login User (Generate JWT Token)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ err: "Invalid user" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(401).json({ err: "Invalid user" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ err: "Invalid user" });
    }

    const token = await getToken(email, user);
    const userToReturn = { ...user.toJSON(), token };
    delete userToReturn.password;
    req.session.user = { email: user.email, role: user.role };
    return res.status(200).json(userToReturn);
});

// 3. Get All Users (Admin only)
router.get("/users", isAuthenticated, async (req, res) => {
    try {
        // Only Admins should be able to access this route
        if (req.user.role !== "Admin") {
            return res.status(403).json({ msg: "Access Denied" });
        }

        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 4. Get User by ID (Admin only)
router.get("/user/:id", isAuthenticated, async (req, res) => {
    try {
        // Only Admins should be able to access this route
        if (req.user.role !== "Admin") {
            return res.status(403).json({ msg: "Access Denied" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 5. Update User Information (Admin only)
router.put("/user/:id", isAuthenticated, async (req, res) => {
    try {
        // Only Admins should be able to access this route
        if (req.user.role !== "Admin") {
            return res.status(403).json({ msg: "Access Denied" });
        }

        const { name, email, password, gender, role } = req.body;

        const userFields = {
            name,
            email,
            gender,
            role,
        };

        // If password is provided, hash it before saving
        if (password) {
            const salt = await bcrypt.genSalt(10);
            userFields.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(req.params.id, { $set: userFields }, { new: true });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 6. Delete a User (Admin only)
router.delete("/user/:id", isAuthenticated, async (req, res) => {
    try {
        // Only Admins should be able to access this route
        if (req.user.role !== "Admin") {
            return res.status(403).json({ msg: "Access Denied" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        await user.remove();
        res.json({ msg: "User deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
