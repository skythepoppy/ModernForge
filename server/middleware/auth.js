const jwt = require("jsonwebtoken");

// middleware to verify JWT
function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ message: "Access denied, no token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info to request
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
}

//  allow only admins
function adminMiddleware(req, res, next) {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admins only" });
    next();
}

// helper to generate Axios headers config for frontend calls
function getAuthHeader(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

module.exports = { authMiddleware, adminMiddleware, getAuthHeader };
