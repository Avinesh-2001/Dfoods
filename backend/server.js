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
app.use((req, res, next) => {
  // Only log important requests (skip static files and OPTIONS)
  if (req.method !== 'OPTIONS' && !req.url.includes('favicon')) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
  }
  next();
});

// Health check endpoint (for Render)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
app.use('/api/test', testEmailRoutes);

// TEMPORARY: OAuth2 callback endpoint to get refresh token
// Remove this after you get your GMAIL_REFRESH_TOKEN
app.get('/oauth2callback', async (req, res) => {
  try {
    const { google } = await import('googleapis');
    const OAuth2 = google.auth.OAuth2;
    
    const oauth2Client = new OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'https://dfoods.onrender.com/oauth2callback'
    );
    
    const code = req.query.code;
    if (!code) {
      return res.send(`
        <html>
          <body style="font-family: Arial; padding: 20px; max-width: 800px; margin: 0 auto;">
            <h1>OAuth2 Callback</h1>
            <p>No authorization code received.</p>
            <p>Visit the authorization URL to start the flow.</p>
          </body>
        </html>
      `);
    }
    
    const { tokens } = await oauth2Client.getToken(code);
    
    res.send(`
      <html>
        <head>
          <title>✅ Gmail OAuth2 Refresh Token</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .success { background: #d4edda; border: 2px solid #28a745; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .token { background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: 'Courier New', monospace; word-break: break-all; margin: 10px 0; border: 1px solid #dee2e6; }
            .warning { background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .info { background: #d1ecf1; border: 2px solid #17a2b8; padding: 15px; border-radius: 5px; margin: 20px 0; }
            button { background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 5px; }
            button:hover { background: #0056b3; }
            code { background: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
            h1 { color: #28a745; }
            h2 { color: #333; }
            ol { line-height: 1.8; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Gmail OAuth2 Refresh Token Generated!</h1>
            
            <div class="success">
              <h2>Your Refresh Token:</h2>
              <div class="token" id="refreshToken">${tokens.refresh_token || 'ERROR: Refresh token not received. Try again with prompt=consent in the auth URL.'}</div>
              <button onclick="copyToken()">📋 Copy Refresh Token</button>
            </div>

            ${tokens.refresh_token ? `
            <div class="info">
              <h3>✅ Success! Next Steps:</h3>
              <ol>
                <li><strong>Copy the refresh token above</strong></li>
                <li>Go to your <a href="https://dashboard.render.com" target="_blank">Render Dashboard</a></li>
                <li>Select your backend service (dfoods.onrender.com)</li>
                <li>Go to "Environment" tab</li>
                <li>Add this environment variable: <code>GMAIL_REFRESH_TOKEN</code> = <code>${tokens.refresh_token}</code></li>
                <li>Also ensure these are set:
                  <ul>
                    <li><code>GMAIL_CLIENT_ID</code> = <code>435536199150-45qkuagjh5ou7hudabjestbgfbaff7nk.apps.googleusercontent.com</code></li>
                    <li><code>GMAIL_CLIENT_SECRET</code> = <code>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</code></li>
                    <li><code>GMAIL_REDIRECT_URI</code> = <code>https://dfoods.onrender.com</code></li>
                    <li><code>GMAIL_USER</code> = <code>avijangid7011@gmail.com</code></li>
                  </ul>
                </li>
                <li>Redeploy your service</li>
                <li><strong>Remove this /oauth2callback endpoint from server.js after setup</strong></li>
              </ol>
            </div>
            ` : `
            <div class="warning">
              <h3>⚠️ Refresh Token Not Received</h3>
              <p>This usually happens if you've already authorized the app before. Try this:</p>
              <ol>
                <li>Go to <a href="https://myaccount.google.com/permissions" target="_blank">Google Account Permissions</a></li>
                <li>Find "Dfoods" or your app and remove it</li>
                <li>Try the authorization URL again</li>
              </ol>
            </div>
            `}

            <div class="warning">
              <h3>⚠️ Security Note</h3>
              <p>After you've copied the refresh token and added it to Render, please <strong>remove this /oauth2callback endpoint</strong> from your server.js file for security.</p>
            </div>
          </div>
          
          <script>
            function copyToken() {
              const token = document.getElementById('refreshToken').textContent;
              navigator.clipboard.writeText(token).then(() => {
                alert('✅ Refresh token copied to clipboard!');
              }).catch(err => {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = token;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('✅ Refresh token copied to clipboard!');
              });
            }
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    res.send(`
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h1 style="color: red;">Error</h1>
          <p>${error.message}</p>
          <pre>${error.stack}</pre>
        </body>
      </html>
    `);
  }
});

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