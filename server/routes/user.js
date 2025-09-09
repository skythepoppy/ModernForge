const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.js"); // middleware 


router.get("/profile", verifyToken, (req, res) => {
    // req.user is set by verifyToken (decoded JWT)
    res.json({
        message: "User profile fetched successfully",
        user: req.user
    });
});


router.get("/all", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    res.json({
        message: "All users would be listed here"
    });
});

module.exports = router;
