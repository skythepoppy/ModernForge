const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/auth.js"); // middleware
const db = require("../db.js"); // knex

// Get logged-in user's profile
router.get("/profile", authMiddleware, async (req, res) => {
    // req.user is set by authMiddleware 
    try {
        const userRows = await db("users").where({ id: req.user.id }).select("id", "name", "email", "role");
        if (!userRows.length) return res.status(404).json({ message: "User not found" });
        res.json({
            message: "User profile fetched successfully",
            user: userRows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin route to fetch all users
router.get("/all", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await db("users").select("id", "name", "email", "role");
        res.json({
            message: "All users fetched successfully",
            users
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})
