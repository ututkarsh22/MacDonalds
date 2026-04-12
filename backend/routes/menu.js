import express from "express";
const router = express.Router();
import Product from "../models/Products.js";


router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/', async (req, res) => {
  try {
    const { category, isVegetarian, isPopular } = req.query;
    
    const filter = {};
    
    filter.stock = { $gt: 0 };

    if (category) {
      filter.category = category;
    }
    
    if (isVegetarian === 'true') {
      filter.isVegetarian = true;
    }
    
    if (isPopular === 'true') {
      filter.isPopular = true;
    }
    
    
    const menuItems = await Product.find(filter).sort({ category: 1, name: 1 });
    
    res.status(200).json({
      success : true,
      message : "Item fetched",
      product : menuItems
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const menuItem = await Product.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.status(200).json(menuItem);
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




export default router;