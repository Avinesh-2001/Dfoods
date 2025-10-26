import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid token. Admin not found.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied. Super admin required.' });
  }
  next();
};