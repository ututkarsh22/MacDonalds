import express from "express";
import User from "../models/User.js";
import upload from "../middleware/multer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Product from "../models/Products.js";
import cloudinary from "../config/cloudinary.js"

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
      secure: process.env.NODE_ENV === 'production', // set true in production with HTTPS
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
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
    secure: process.env.NODE_ENV === 'production', // same as you used during login
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  });
  res.status(200).json({ message: "Admin logged out successfully" });
}

export const verify = async (req, res) => {
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
    if (!users) {
      res.send({
        status: false,
        message: "no user found"
      })
      console.log(users)
    }
    res.json(users);
  } catch (err) {
    console.error("Error fetching customers:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
}


export const deletingMenu = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.admin.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const updatingMenu = async (req, res) => {
  try {
    if (!req.admin.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const menuItem = await Product.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

   
    if (req.file) {
      console.log("old image:", menuItem.image);


      await cloudinary.uploader.destroy(menuItem.image.public_id);

    
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "menu_items" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      menuItem.image.public_id = result.public_id;
      menuItem.image.url = result.secure_url;
    }

    menuItem.name = req.body.name;
    menuItem.description = req.body.description;
    menuItem.price = req.body.price;
    menuItem.category = req.body.category;
    menuItem.isVegetarian = req.body.isVegetarian;
    menuItem.isPopular = req.body.isPopular;
    menuItem.stock = req.body.stock;

    await menuItem.save();

    res.status(200).json({
      message: 'Menu item updated successfully',
      menuItem
    });

  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createMenu = async (req, res) => {
  try {


    if (!req.admin.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "menu_items" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    console.log(req.file.path);
    console.log(result);
    const {
      name, description, price, category, isVegetarian, isPopular, stock
    } = req.body;

    const menuItem = new Product({
      name,
      description,
      price,
      category,
      image: {
        public_id: result.public_id,
        url: result.secure_url
      },
      isPopular,
      isVegetarian,
      stock
    });

    await menuItem.save();

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const getMenu = async (req, res) => {

  try {
    const product = await Product.find();
    console.log(product);
    res.json({
      success: true,
      message: "All menu fetched",
      product
    })
  } catch (error) {
    res.json({
      success: false,
      message: "Internal Server Problem"
    })
  }

}