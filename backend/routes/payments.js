// import express from "express";
// import Razorpay from "razorpay";
// import crypto from "crypto";
// import authenticateToken from "../middleware/auth.js";
// import Order from "../models/Order.js";

// const router = express.Router();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// router.post("/create-order", authenticateToken, async (req, res) => {
//   try {
//     const { orderId } = req.body;

//     if (!orderId) {
//       return res.status(400).json({ message: "Order ID required" });
//     }

//     // ✅ Get order from DB
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // ✅ Security check
//     if (order.userId.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     // ✅ Create Razorpay order (amount in paise)
//     const razorpayOrder = await razorpay.orders.create({
//       amount: order.totalAmount * 100,
//       currency: "INR",
//       receipt: `receipt_${order._id}`
//     });

//     // ✅ Save status
//     order.paymentStatus = "Pending";
//     await order.save();

//     res.json({
//       success: true,
//       razorpayOrder
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to create Razorpay order",
//       error: error.message
//     });
//   }
// });

// router.post("/verify", authenticateToken, async (req, res) => {
//   try {
//     const {
//       orderId,
//       paymentId,
//       razorpayOrderId,
//       razorpaySignature
//     } = req.body;

//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // ✅ Verify signature
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpayOrderId}|${paymentId}`)
//       .digest("hex");

//     if (generatedSignature !== razorpaySignature) {
//       order.paymentStatus = "Failed";
//       await order.save();

//       return res.status(400).json({
//         success: false,
//         message: "Payment verification failed"
//       });
//     }

//     // ✅ Payment success
//     order.paymentStatus = "Paid";
//     order.paymentDetails = {
//       paymentId,
//       razorpayOrderId,
//       method: "Razorpay",
//       timestamp: new Date()
//     };

//     await order.save();

//     res.json({
//       success: true,
//       message: "Payment successful",
//       order
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: "Verification failed",
//       error: error.message
//     });
//   }
// });
// router.get("/key", (req, res) => {
//   res.json({
//     key: process.env.RAZORPAY_KEY_ID
//   });
// });


// export default router;