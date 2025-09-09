const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db.js"); // MySQL connection

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if user exists
    const [userCheck] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (userCheck.length > 0) return res.status(400).json({ message: "User already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const [result] = await db.promise().query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // fetch newly created user
    const [newUserRows] = await db.promise().query("SELECT id, name, email, role FROM users WHERE id = ?", [result.insertId]);

    res.json(newUserRows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [userRows] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (userRows.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, userRows[0].password);
    if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: userRows[0].id, role: userRows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: userRows[0].id,
        name: userRows[0].name,
        email: userRows[0].email,
        role: userRows[0].role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
