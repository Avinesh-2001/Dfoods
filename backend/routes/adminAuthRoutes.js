import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Get admin profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ admin });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Create default admin (for development)
router.post('/create-default', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@dfoods.com' });
    if (existingAdmin) {
      return res.json({ message: 'Default admin already exists' });
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      name: 'Admin User',
      email: 'admin@dfoods.com',
      password: hashedPassword,
      role: 'super_admin'
    });

    await admin.save();

    res.json({ message: 'Default admin created successfully' });
  } catch (error) {
    console.error('Create default admin error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

