import express from "express";
import Cart from "../models/Cart.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

// Save / Update cart
router.put("/update-cart", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, total } = req.body;
  
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items, total },
      { upsert: true, new: true }
    );
  
    res.json(cart);
    
  } catch (error) {
    res.json({
      success : false,
      message : "Internal server error"
    })
  }
  
});

// Get cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
  
    const cart = await Cart.findOne({ userId });
    res.json(cart || { items: [], total: 0 });
    
  } catch (error) {
    res.json({
      success : false,
      message : "Internal Server Error"
    })
  }
});

export default router;
