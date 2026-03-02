import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

     const adminMail = process.env.ADMIN_EMAIL
     const adminPass = process.env.ADMIN_PASSWORD

    if (email !== adminMail || password !== adminPass) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      { isAdmin: true, email },
      process.env.JWT_SECRET,
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
}

export const logout = (req, res) => {
   res.clearCookie("adminToken", {
    httpOnly: true,
    secure: false, // same as you used during login
    sameSite: "lax",
  });
  res.status(200).json({ message: "Admin logged out successfully" });
}

export const verify = async(req, res) => {
  const token = req.cookies.adminToken;
  if (!token) return res.status(401).json({ valid: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ valid: false });
    res.json({ valid: true });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
}

export const customer = async (req, res) => {
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
}