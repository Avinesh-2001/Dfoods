import express from "express";
import { authenticateAdmin } from "../middlewares/adminAuth.js";
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Contact from '../models/Contact.js';
import Review from '../models/Review.js';

const router = express.Router();

// Dashboard overview
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      totalReviews,
      pendingReviews,
      recentOrders
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Review.countDocuments(),
      Review.countDocuments({ isApproved: false }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email')
    ]);

    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalReviews,
        pendingReviews,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentOrders
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});

// Get all users
router.get("/users", authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments();

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get all products
router.get("/products", authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 1000 } = req.query; // Increased default limit for admin dashboard
    console.log(`📦 Fetching products - page: ${page}, limit: ${limit}`);
    
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) || 1000)
      .skip((parseInt(page) - 1) * (parseInt(limit) || 1000));

    const total = await Product.countDocuments();
    console.log(`✅ Found ${products.length} products (total: ${total})`);

    res.json({
      products,
      totalPages: Math.ceil(total / (parseInt(limit) || 1000)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get all orders
router.get("/orders", authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments();

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get all reviews
router.get("/reviews", authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    
    let filter = {};
    if (status === 'approved') filter.isApproved = true;
    if (status === 'pending') filter.isApproved = false;

    const reviews = await Review.find(filter)
      .populate('productId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// Get all contacts
router.get("/contacts", authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments();

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
});

export default router;