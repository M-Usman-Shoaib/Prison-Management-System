const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const passport = require("passport");
const router = express.Router();
const { getToken } = require("../utilities/helpers");



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
        return res.status(401).json({ err: "Invalid credentials" });
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
    return res.status(200).json(userToReturn);
});


module.exports = router;
