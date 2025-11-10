const express = require("express");
const jwt = require("jsonwebtoken");
const verifyAdmin =  require("../middleware/adminAuth.js");
const User = require("../models/User.js");
const router = express.Router();

// Admin login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔐 Simple static credentials (for now)
    const ADMIN_EMAIL = "admin@mcd.com";
    const ADMIN_PASSWORD = "admin123";

    // Check if credentials match
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      { isAdmin: true, email },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );

    // ✅ Set token in HTTP-only cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: false, // set true in production with HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({ message: "Admin logged in successfully" });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ✅ Logout route
router.post("/logout", (req, res) => {
   res.clearCookie("adminToken", {
    httpOnly: true,
    secure: false, // same as you used during login
    sameSite: "lax",
  });
  res.status(200).json({ message: "Admin logged out successfully" });
});

// ✅ Example protected route (only admin can access)
router.get("/", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard", admin: req.admin });
});

router.get("/customers",async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide passwords
    if(!users)
    {
        res.send({
            status : false,
            message : "no user found"
        })
        console.log(users)
    }
    res.json(users);
  } catch (err) {
   console.error("Error fetching customers:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
