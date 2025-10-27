import express from 'express';
import { adminLogin } from '../controllers/adminController.js';
import { authenticateAdmin } from '../middlewares/adminAuth.js';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

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
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get all reviews (filter by ?status=pending/approved)
router.get('/reviews', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status === 'pending') filter.isApproved = false;
    else if (status === 'approved') filter.isApproved = true;

    const reviews = await Review.find(filter)
      .populate('productId', 'name price')
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Approve / Reject review
router.put('/reviews/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review approval updated', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Delete review
router.delete('/reviews/:id', authenticateAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
