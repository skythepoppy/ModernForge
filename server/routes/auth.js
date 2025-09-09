const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db.js"); // Knex connection

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role, adminKey } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Default role = 'user'
    let assignedRole = "user";

    // Assign admin role only if valid ADMIN_KEY provided
    if (role === "admin") {
      if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({ message: "Cannot assign admin role without valid key" });
      }
      assignedRole = "admin";
    }

    // Check if user exists
    const existingUsers = await db("users").where({ email }).select();
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [insertId] = await db("users").insert({ name, email, password: hashedPassword, role: assignedRole });

    // Fetch newly created user
    const newUser = await db("users")
      .where({ id: insertId })
      .select("id", "name", "email", "role")
      .first();

    res.status(201).json(newUser);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Fetch user
    const user = await db("users").where({ email }).select().first();
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
