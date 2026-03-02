import express from 'express';
const router = express.Router();
import  authenticateToken  from '../middleware/auth.js';
import { register, login, logout, userProfile, updatePassword } from '../controller/auth.controller.js';

// Register User
router.post('/register', register);

// Login User
router.post('/login', login);

// Logout User
router.post('/logout', logout);

// Get Current User
router.get('/user', authenticateToken, userProfile);

// Update User Profile
router.put('/update-profile', authenticateToken, updatePassword);


export default router;