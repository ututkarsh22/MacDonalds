const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import scheduled tasks
const { initScheduledTasks } = require('./utils/scheduledTasks');

// Import routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');

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
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

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