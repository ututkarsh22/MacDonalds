const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { authenticateToken } = require('../middleware/auth');

// Create Order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { orderType, paymentMethod, address, items } = req.body;
    
    // Validate inputs
    if (!orderType || !['Dine-In', 'Takeaway'].includes(orderType)) {
      return res.status(400).json({ message: 'Valid order type is required (Dine-In or Takeaway)' });
    }
    
    if (!paymentMethod || !['Card', 'UPI', 'Cash'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Valid payment method is required (Card, UPI, or Cash)' });
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }
    
    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];
    
    // Process each item
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item not found: ${item.menuItemId}` });
      }
      
      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        totalPrice: itemTotal,
        options: item.options || [],
        specialInstructions: item.specialInstructions || ''
      });
    }
    
    // Calculate tax and delivery fee
    const tax = subtotal * 0.18; // 18% tax
    const deliveryFee = orderType === 'Takeaway' ? 40.00 : 0;
    const total = subtotal + tax + deliveryFee;
    
    // Create new order
    const order = new Order({
      userId: req.user.id,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      orderType,
      paymentMethod,
      address: address || ''
    });
    
    await order.save();
    
    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders for the current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = { userId: req.user.id };
    
    // Add status filter if provided
    if (status && ['Processing', 'Preparing', 'Ready', 'Completed', 'Delivered', 'Cancelled'].includes(status)) {
      query.status = status;
    }
    
    // Get total count for pagination
    const total = await Order.countDocuments(query);
    
    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.menuItemId', 'name image');
    
    res.json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recent orders for the current user
router.get('/recent/:limit?', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;
    
    const orders = await Order.getUserRecentOrders(req.user.id, limit);
    
    res.json(orders);
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('items.menuItemId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel Order
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only allow cancellation if order is in 'Processing' or 'Preparing' status
    if (!['Processing', 'Preparing'].includes(order.status)) {
      return res.status(400).json({
        message: 'Only orders in Processing or Preparing status can be cancelled'
      });
    }
    
    // Update order status using the instance method
    await order.updateStatus('Cancelled', cancellationReason || 'Cancelled by customer');
    
    // If payment was already made, update payment status to 'Refunded'
    if (order.paymentStatus === 'Paid') {
      await order.updatePaymentStatus('Refunded');
    }
    
    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reorder an existing order
router.post('/reorder', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // Validate input
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }
    
    // Find the original order
    const originalOrder = await Order.findOne({
      _id: orderId,
      userId: req.user.id
    }).populate('items.menuItemId');
    
    if (!originalOrder) {
      return res.status(404).json({ message: 'Original order not found' });
    }
    
    // Get or create user's cart
    const cart = await Cart.findOrCreateCart(req.user.id);
    
    // Clear existing cart items
    await cart.clearCart();
    
    // Add original order items to cart
    for (const item of originalOrder.items) {
      // Check if menu item still exists and is available
      const menuItem = await MenuItem.findById(item.menuItemId);
      
      if (!menuItem) {
        return res.status(400).json({ 
          message: `Item '${item.name}' is no longer available in our menu` 
        });
      }
      
      if (!menuItem.isAvailable) {
        return res.status(400).json({ 
          message: `Item '${menuItem.name}' is currently unavailable` 
        });
      }
      
      // Parse options from strings back to objects
      const options = item.options.map(optStr => {
        const [name, choice] = optStr.split(': ');
        return { name, choice, priceAdjustment: 0 }; // We don't have the original price adjustments
      });
      
      // Add item to cart
      await cart.addItem(menuItem, item.quantity, options, item.specialInstructions || '');
    }
    
    // Set delivery fee based on original order type
    if (originalOrder.orderType === 'Takeaway') {
      await cart.setDeliveryFee(40.00);
    } else {
      await cart.setDeliveryFee(0);
    }
    
    // Apply any promo code if it was used in the original order
    if (originalOrder.promoCodeUsed) {
      await cart.applyPromoCode(originalOrder.promoCodeUsed, originalOrder.discount);
    }
    
    // Populate cart items
    await cart.populate('items.menuItemId');
    
    res.status(200).json({
      message: 'Items added to cart from previous order',
      cart
    });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, note } = req.body;
    
    // Validate input
    if (!status || !['Processing', 'Preparing', 'Ready', 'Completed', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // TODO: Add admin check here
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ message: 'Unauthorized' });
    // }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order status
    await order.updateStatus(status, note || '');
    
    // If status is 'Completed' or 'Delivered', update payment status to 'Paid'
    if (['Completed', 'Delivered'].includes(status) && order.paymentStatus === 'Pending') {
      await order.updatePaymentStatus('Paid');
    }
    
    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update estimated delivery time
router.put('/:id/delivery-time', authenticateToken, async (req, res) => {
  try {
    const { minutes } = req.body;
    
    // Validate input
    if (!minutes || isNaN(parseInt(minutes)) || parseInt(minutes) <= 0) {
      return res.status(400).json({ message: 'Valid minutes are required' });
    }
    
    // TODO: Add admin check here
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ message: 'Unauthorized' });
    // }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update estimated delivery time
    await order.updateEstimatedDeliveryTime(parseInt(minutes));
    
    res.json({
      message: 'Estimated delivery time updated successfully',
      order
    });
  } catch (error) {
    console.error('Update delivery time error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;