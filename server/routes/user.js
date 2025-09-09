const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.js"); // middleware 

// Get logged-in user's profile
router.get("/profile", verifyToken, (req, res) => {
    // req.user is set by verifyToken (decoded JWT)
    res.json({
        message: "User profile fetched successfully",
        user: req.user
    });
});

// Admin route to fetch all users
router.get("/all", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    try {
        const db = req.app.get('db'); // get MySQL connection
        const [users] = await db.promise().query("SELECT id, name, email, role FROM users");
        res.json({
            message: "All users fetched successfully",
            users
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
