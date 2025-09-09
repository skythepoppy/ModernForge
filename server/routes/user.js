const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.js"); // middleware 

// Example: get logged-in user's profile
router.get("/profile", verifyToken, (req, res) => {
  // req.user is set by verifyToken (decoded JWT)
  res.json({
    message: "User profile fetched successfully",
    user: req.user
  });
});

// Example: admin route to fetch all users
router.get("/all", verifyToken, (req, res) => {
  // you'd add role-check logic here if needed
  res.json({
    message: "All users would be listed here"
  });
});

module.exports = router;
