import express from 'express';
import { adminLogin } from '../controllers/adminController.js';
import { authenticateAdmin } from '../middlewares/adminAuth.js';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

const router = express.Router();

// Create admin (temporary, for testing)
router.post('/create-admin', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });
    const admin = await Admin.create({ name, email, password });
    res.json({ message: 'Admin created', admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route
router.post('/login', adminLogin);

// Get all users for admin dashboard (protected)
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    console.log('Fetching users for admin dashboard');
    const users = await User.find().select('-password');
    console.log('Users fetched:', users.length);
    res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;