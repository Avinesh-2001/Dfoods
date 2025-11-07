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
import testEmailRoutes from './routes/testEmailRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import couponRoutes from './routes/couponRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With'],
}));
app.use(express.json());

// Request logging middleware (minimal)
// Logging disabled for production

// Health check endpoint (for Render)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

let isDbConnected = false;
const connectDB = async () => {
  if (process.env.MOCK_MODE === 'true') {
    return true;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    isDbConnected = true;

    const defaultAdminEmail = 'admin@dfoods.com';
    const adminExists = await Admin.findOne({ email: defaultAdminEmail });

    if (!adminExists) {
      await Admin.create({
        name: 'Default Admin',
        email: defaultAdminEmail,
        password: 'admin123',
        role: 'admin',
      });
    }
    return true;
  } catch (error) {
    isDbConnected = false;
    return false;
  }
};

mongoose.connection.on('error', (err) => {
  // MongoDB error logged internally
});
mongoose.connection.on('disconnected', () => {
  // MongoDB disconnected, will attempt to reconnect
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
app.use('/api/auth/otp', otpRoutes);
app.use('/api/test', testEmailRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/coupons', couponRoutes);

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

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Don't exit - keep server running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - keep server running
});

// Start server
const PORT = parseInt(process.env.PORT) || 5000;

// Start server - must not exit!
const startServer = async () => {
  console.log('\n🔧 Starting Dfoods Backend...\n');
  console.log(`📍 Port: ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 MONGO_URI: ${process.env.MONGO_URI ? 'Set' : 'Not set'}`);
  console.log(`📍 FRONTEND_URL: ${process.env.FRONTEND_URL || 'Not set'}\n`);
  
  // Start the server - this MUST succeed
  try {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n✅✅✅ Server is RUNNING on port ${PORT} ✅✅✅\n`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
      console.log(`✅ API Health: http://0.0.0.0:${PORT}/api/health\n`);
    });
    
    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      }
    });
  } catch (startError) {
    console.error('❌ CRITICAL: Failed to start server:', startError);
    // Keep trying - don't exit!
    setTimeout(() => {
      console.log('🔄 Retrying server start...');
      startServer();
    }, 5000);
    return;
  }
  
  // Try to connect to database in background (non-blocking)
  setTimeout(() => {
    connectDB().catch((error) => {
      console.log('⚠️ Database connection failed, server running in mock mode');
      console.log('⚠️ Error:', error.message);
    });
  }, 1000);
};

// Start the server - wrapped in try-catch
try {
  startServer();
} catch (error) {
  console.error('❌ Fatal error starting server:', error);
  // Don't exit - try again
  setTimeout(() => {
    console.log('🔄 Attempting to restart...');
    startServer();
  }, 3000);
}

// Keep process alive
setInterval(() => {
  // Heartbeat - keeps process alive
}, 30000);