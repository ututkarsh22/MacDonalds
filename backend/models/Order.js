import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      name: String,
      price: Number,
      quantity: Number
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  orderType: {
    type: String,
    enum: ["Dine-In", "Takeaway"],
    required: true
  },

  address: {
    type: String
  },

  paymentMethod: {
    type: String,
    enum: ["Card", "UPI", "Cash"],
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },

  orderStatus: {
    type: String,
    enum: ["Placed", "Preparing", "Delivered"],
    default: "Placed"
  },

  paymentDetails: {
    paymentId: String,
    razorpayOrderId: String,
    method: String,
    timestamp: Date
  }

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);