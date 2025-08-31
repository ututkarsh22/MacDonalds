const mongoose = require('mongoose');

// Order item schema
const orderItemSchema = new mongoose.Schema({
  menuItemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MenuItem', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1
  },
  price: { 
    type: Number, 
    required: true 
  },
  totalPrice: {
    type: Number,
    required: true
  },
  options: [
    { type: String }
  ],
  specialInstructions: {
    type: String,
    default: ''
  }
}, { _id: true, timestamps: false });



// Calculate total price for an order item
orderItemSchema.pre('save', function(next) {
  this.totalPrice = this.price * this.quantity;
  next();
});

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderNumber: {
    type: String,
    required: true,
    default: function() {
      // Generate a random order number with format: MC-YYYYMMDD-XXXX
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
      return `MC-${year}${month}${day}-${random}`;
    }
  },
  items: [orderItemSchema],
  subtotal: { 
    type: Number, 
    required: true 
  },
  tax: { 
    type: Number, 
    required: true,
    default: function() {
      return parseFloat((this.subtotal * 0.05).toFixed(2)); // 5% tax
    }
  },
  deliveryFee: { 
    type: Number, 
    default: 0 
  },
  discount: {
    type: Number,
    default: 0
  },
  promoCodeUsed: {
    type: String,
    default: null
  },
  total: { 
    type: Number, 
    required: true,
    default: function() {
      return parseFloat((this.subtotal + this.tax + this.deliveryFee - this.discount).toFixed(2));
    }
  },
  orderType: { 
    type: String, 
    enum: ['Dine-In', 'Takeaway'], 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    enum: ['Card', 'UPI', 'Cash'], 
    required: true 
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentDetails: {
    type: Object,
    default: null
  },
  address: { 
    type: String,
    default: ''
  },
  customerNotes: {
    type: String,
    default: ''
  },
  status: { 
    type: String, 
    enum: ['Processing', 'Preparing', 'Ready', 'Completed', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: ['Processing', 'Preparing', 'Ready', 'Completed', 'Delivered', 'Cancelled']
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      note: {
        type: String,
        default: ''
      }
    }
  ],
  estimatedDeliveryTime: {
    type: Date,
    default: function() {
      // Default to 30 minutes from now for delivery
      const deliveryTime = new Date();
      deliveryTime.setMinutes(deliveryTime.getMinutes() + 30);
      return deliveryTime;
    }
  }
}, { timestamps: true });

// Pre-save hook to update status history
orderSchema.pre('save', function(next) {
  // If this is a new document or the status has changed
  if (this.isNew || this.isModified('status')) {
    // Add status change to history
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: ''
    });
  }
  
  next();
});

// Instance methods
orderSchema.methods = {
  // Update order status
  async updateStatus(newStatus, note = '') {
    if (!['Processing', 'Preparing', 'Ready', 'Completed', 'Delivered', 'Cancelled'].includes(newStatus)) {
      throw new Error('Invalid status');
    }
    
    this.status = newStatus;
    this.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      note: note
    });
    
    return this.save();
  },
  
  // Update payment status
  async updatePaymentStatus(newStatus) {
    if (!['Pending', 'Paid', 'Failed', 'Refunded'].includes(newStatus)) {
      throw new Error('Invalid payment status');
    }
    
    this.paymentStatus = newStatus;
    return this.save();
  },
  
  // Calculate estimated delivery time
  async updateEstimatedDeliveryTime(minutes) {
    const deliveryTime = new Date();
    deliveryTime.setMinutes(deliveryTime.getMinutes() + minutes);
    this.estimatedDeliveryTime = deliveryTime;
    
    return this.save();
  }
};

// Static methods
orderSchema.statics = {
  // Get orders by status
  async getOrdersByStatus(status) {
    return this.find({ status }).sort({ createdAt: -1 });
  },
  
  // Get orders by date range
  async getOrdersByDateRange(startDate, endDate) {
    return this.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ createdAt: -1 });
  },
  
  // Get user's recent orders
  async getUserRecentOrders(userId, limit = 5) {
    return this.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
};

module.exports = mongoose.model('Order', orderSchema);