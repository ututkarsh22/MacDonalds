import express from "express";
import mongoose  from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"
dotenv.config();

// Import scheduled tasks
import initScheduledTasks from './utils/scheduledTasks.js';

// Import routes
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/adminRoutes.js';
import cartRoutes from './routes/cart.js'

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://mac-donalds-dun.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// Use routes
app.get('/', (req, res) => {
  res.send('Welcome to the McD Clone API');
});
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin',adminRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize scheduled tasks
  initScheduledTasks();
});