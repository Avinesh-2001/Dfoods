// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import adminDashboardRoutes from './routes/adminDashboardRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import otpRoutes from './routes/otpRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Request logging middleware (minimal)
app.use((req, res, next) => {
  // Only log important requests (skip static files and OPTIONS)
  if (req.method !== 'OPTIONS' && !req.url.includes('favicon')) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
  }
  next();
});

let isDbConnected = false;
const connectDB = async () => {
  if (process.env.MOCK_MODE === 'true') {
    console.log('MOCK_MODE enabled - skipping MongoDB connection');
    return true;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    isDbConnected = true;
    console.log('✅ MongoDB Connected');

    const defaultAdminEmail = 'admin@dfoods.com';
    const adminExists = await Admin.findOne({ email: defaultAdminEmail });

    if (!adminExists) {
      const newAdmin = await Admin.create({
        name: 'Default Admin',
        email: defaultAdminEmail,
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Default admin created successfully');
    } else {
      console.log('✅ Default admin already exists');
    }
    return true;
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed. Running in MOCK_MODE. Error:', error.message);
    isDbConnected = false;
    return false;
  }
};

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

// Routes
// If DB isn't connected yet, serve mock products quickly to avoid frontend timeouts
app.get('/api/products', (req, res, next) => {
  if (isDbConnected) {
    return next();
  }
  return res.json(mockProducts);
});
// Lightweight mock products when DB is not available or MOCK_MODE=true
const mockProducts = [
  {
    _id: 'p1',
    name: 'Premium Organic Jaggery Cubes',
    category: 'jaggery-cubes',
    price: 899,
    images: ['https://via.placeholder.com/300x200?text=Jaggery+Cubes'],
    inStock: true,
  },
  {
    _id: 'p2',
    name: 'Traditional Jaggery Powder',
    category: 'jaggery-powder',
    price: 650,
    images: ['https://via.placeholder.com/300x200?text=Jaggery+Powder'],
    inStock: true,
  },
  {
    _id: 'p3',
    name: 'Organic Plain Jaggery Block',
    category: 'plain-jaggery',
    price: 450,
    images: ['https://via.placeholder.com/300x200?text=Plain+Jaggery'],
    inStock: true,
  },
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: isDbConnected ? 'connected' : 'mock' });
});

if (process.env.MOCK_MODE === 'true') {
  app.get('/api/products', (req, res) => {
    res.json(mockProducts);
  });
}

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', productRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin/emails', emailRoutes);
// app.use('/api/auth', otpRoutes);
app.use('/api/auth/otp', otpRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Catch unexpected GET /api/login
app.get('/api/login', (req, res) => {
  console.log('Unexpected GET /api/login request');
  res.status(405).json({ message: 'Method Not Allowed. Use POST for /api/admin/login or /api/users/login' });
});

// Catch-all route for unmatched requests
app.use((req, res) => {
  console.log(`Unmatched request: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = parseInt(process.env.PORT) || 5000;

const startServer = async () => {
  console.log('\n🔧 Starting Dfoods Backend...\n');
  
  // Start the server immediately
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`✅ API Health: http://0.0.0.0:${PORT}/api/health\n`);
  });
  
  // Try to connect to database in background
  try {
    await connectDB();
  } catch (error) {
    console.log('⚠️ Server running without database');
  }
};

startServer();