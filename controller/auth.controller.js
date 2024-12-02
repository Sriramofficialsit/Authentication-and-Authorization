const express = require('express');
const auth = express.Router();
const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifytoken } = require('../middlewares/auth.middleware');

// Registration Route
auth.post("/register", async function (req, res) {
    try {
        const { username, password, email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email
        });
        await newUser.save();

        res.status(201).json({
            message: "User registration successfully completed",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
});

// Login Route
auth.post("/login", async function (req, res) {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }

        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false
            });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });


        res.status(200).json({
            message: "User logged in successfully",
            success: true,
            Token:token
        });


    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
});

auth.get("/me", verifytoken, async (req, res) => {
    try {
        // Find user by ID and exclude sensitive fields
        const user = await User.findById(req.user.id).select("-password -__v");
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Return user details
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching user details",
            success: false,
            error: error.message,
        });
    }
});

module.exports = auth;
