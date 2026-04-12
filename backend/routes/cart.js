import express from "express";
import Cart from "../models/Cart.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();


router.put("/add-cart", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, total } = req.body;

    let cart = await Cart.findOne({ userId });

    // 🟢 If cart doesn't exist → create
    if (!cart) {
      cart = await Cart.create({
        userId,
        items,
        total
      });
    } 
    // 🟢 If cart exists → update
    else {
      cart = await Cart.findOneAndUpdate(
        { userId },
        { items, total },
        { new: true }
      );
    }

    res.json({
      success: true,
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
   console.log(userId);

    const cart = await Cart.findOne({ userId });
    res.json(cart || { items: [], total: 0 });
    
  } catch (error) {
    res.json({
      success : false,
      message : "Internal Server Error"
    })
  }
});

router.put("/delete-cart/:id",authMiddleware,async(req,res) =>{

  const cart = await Cart.findOne({userId : req.user.id});

  console.log(cart);
})
export default router;
