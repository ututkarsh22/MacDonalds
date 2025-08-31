const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { authenticateToken } = require('../middleware/auth');

// Get All Menu Items
router.get('/', async (req, res) => {
  try {
    const { category, isVegetarian, isPopular } = req.query;
    
    // Build filter object based on query parameters
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (isVegetarian === 'true') {
      filter.isVegetarian = true;
    }
    
    if (isPopular === 'true') {
      filter.isPopular = true;
    }
    
    // Only show available items
    filter.isAvailable = true;
    
    const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    
    res.status(200).json(menuItems);
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Menu Item by ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.status(200).json(menuItem);
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Menu Categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Routes (Protected)

// Create Menu Item (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin (you would need to add isAdmin field to User model)
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { 
      name, description, price, category, image, 
      size, allergens, ingredients, nutrition,
      isVegetarian, isSpicy, isPopular, isAvailable 
    } = req.body;
    
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      image,
      size,
      allergens,
      ingredients,
      nutrition,
      isVegetarian,
      isSpicy,
      isPopular,
      isAvailable
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
});

// Update Menu Item (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.status(200).json({
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Menu Item (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
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
});

module.exports = router;