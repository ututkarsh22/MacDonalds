const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  try {
    const token = req.cookies.adminToken; // ✅ read cookie

    if (!token) return res.status(401).json({ message: "Access denied. No admin token." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) return res.status(403).json({ message: "Not an admin" });

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyAdmin;