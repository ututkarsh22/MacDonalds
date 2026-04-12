import "./config/envConfig.js"
import express from "express";
import mongoose  from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cloudinary from "./config/cloudinary.js";
import initScheduledTasks from './utils/scheduledTasks.js';


import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/adminRoutes.js';
import cartRoutes from './routes/cart.js'

const app = express();
const PORT = process.env.PORT;



// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://mac-donalds-dun.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// Use routes
async function testCloudinary() {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connected:", result);
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.message);
  }
}

testCloudinary();
app.get('/', (req, res) => {
  res.send('Welcome to the McD Clone API');
});
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/payments', paymentRoutes);
app.use('/api/admin',adminRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  initScheduledTasks();
});