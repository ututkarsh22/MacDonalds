const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET'
});

/**
 * @route   POST /api/payments/create-order
 * @desc    Create a Razorpay order
 * @access  Private
 */
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    
    if (!orderId || !amount) {
      return res.status(400).json({ message: 'Order ID and amount are required' });
    }
    
    // Find the order in the database
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify that the order belongs to the current user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this order' });
    }
    
    // Create a Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount), // amount in paise
      currency: 'INR',
      receipt: `receipt_${orderId}`,
      payment_capture: 1 // Auto-capture payment
    });
    
    res.status(200).json({ order: razorpayOrder });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
});

/**
 * @route   POST /api/payments/verify
 * @desc    Verify Razorpay payment
 * @access  Private
 */
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { orderId, paymentId, razorpayOrderId, razorpaySignature } = req.body;
    
    if (!orderId || !paymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ message: 'All payment details are required' });
    }
    
    // Find the order in the database
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify that the order belongs to the current user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this order' });
    }
    
    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET')
      .update(`${razorpayOrderId}|${paymentId}`)
      .digest('hex');
    
    if (generatedSignature !== razorpaySignature) {
      // Update order payment status to failed
      order.paymentStatus = 'Failed';
      await order.save();
      
      return res.status(400).json({ message: 'Payment verification failed' });
    }
    
    // Update order payment status to paid
    order.paymentStatus = 'Paid';
    order.paymentDetails = {
      paymentId,
      razorpayOrderId,
      method: 'Razorpay',
      timestamp: new Date()
    };
    
    await order.save();
    
    res.status(200).json({ message: 'Payment verified successfully', order });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Failed to verify payment', error: error.message });
  }
});

/**
 * @route   GET /api/payments/key
 * @desc    Get Razorpay key ID
 * @access  Private
 */
router.get('/key', authenticateToken, (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID' });
});

module.exports = router;