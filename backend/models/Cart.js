const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  totalPrice: { type: Number, required: true }
}, { _id: true });

cartItemSchema.pre('save', function(next) {
  this.totalPrice = this.price * this.quantity;
  next();
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save: update subtotal, tax, total
cartSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.tax = parseFloat((this.subtotal * 0.05).toFixed(2)); // 5% tax
  this.total = parseFloat((this.subtotal + this.tax).toFixed(2));
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
