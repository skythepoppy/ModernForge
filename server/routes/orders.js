const express = require("express");
const router = express.Router();
const db = require("../db");


//middleware user verification
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Create a new order
router.post("/", authMiddleware, async (req, res) => {
    const { userId, items } = req.body; // items: [{ productId, quantity, price }]
    try {
        for (const item of items) {
            await db.query(
                "INSERT INTO orders (userId, productId, quantity, price) VALUES (?, ?, ?, ?)",
                [userId, item.productId, item.quantity, item.price]
            );
        }
        res.status(201).json({ message: "Order created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating order" });
    }
});

// Get all orders for a user
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    const userId = req.user.id; // assuming verifyToken attaches user to req
    try {
        const [rows] = await db.query(
            "SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC",
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching orders" });
    }
});

module.exports = router;