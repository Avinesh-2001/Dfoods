# Dfood Application - Setup Instructions

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher) - installed and running
- npm or yarn package manager

---

## 📦 Installation Steps

### 1. Clone and Navigate
```bash
cd Dfood
```

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Copy .env.template to .env
copy .env.template .env    # Windows
# OR
cp .env.template .env      # Mac/Linux

# Edit .env file and update the values:
# - MONGO_URI: Your MongoDB connection string
# - JWT_SECRET: A strong secret key (change from default!)
# - STRIPE_SECRET_KEY: Your Stripe API key (if using payments)
```

**Important Environment Variables:**
- `MONGO_URI`: Default is `mongodb://localhost:27017/dfood`
- `JWT_SECRET`: **MUST CHANGE IN PRODUCTION!**
- `PORT`: Default is 5000
- `STRIPE_SECRET_KEY`: Get from https://stripe.com/docs/keys

### 3. Setup Frontend

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies
npm install

# Create environment file
copy .env.template .env.local    # Windows
# OR
cp .env.template .env.local      # Mac/Linux

# The default API URL is http://localhost:5000/api
# Change if your backend runs on different port
```

---

## 🏃 Running the Application

### Start MongoDB (if not running)
```bash
# Windows (if installed as service)
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Start Backend Server
```bash
# From backend directory
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

**Default Admin Account Created Automatically:**
- Email: `admin@dfoods.com`
- Password: `admin123`

### Start Frontend Development Server
```bash
# From frontend directory (in a new terminal)
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

---

## 🧪 Testing the Application

1. **Open Browser**: Navigate to `http://localhost:3000`

2. **Register a User**:
   - Click "Sign Up" in the header
   - Fill in the registration form
   - You'll be logged in automatically

3. **Login as Admin**:
   - Click "Sign In" in the header
   - Use credentials:
     - Email: `admin@dfoods.com`
     - Password: `admin123`
   - You'll be redirected to Admin Dashboard

4. **Admin Dashboard Features**:
   - View registered users
   - Add/Edit/Delete products
   - Upload products via CSV
   - Manage inventory

---

## 📁 Project Structure

```
Dfood/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middlewares/     # Auth middlewares
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── uploads/         # File upload directory
│   ├── server.js        # Express server
│   └── .env            # Environment variables (create from .env.template)
│
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js pages
│   │   ├── components/  # React components
│   │   ├── lib/         # Utilities and stores
│   │   └── types/       # TypeScript types
│   ├── public/          # Static assets
│   └── .env.local       # Environment variables (create from .env.template)
│
└── ANALYSIS_AND_FIXES.md  # Detailed analysis report
```

---

## 🔧 Common Issues & Solutions

### Issue 1: MongoDB Connection Error
**Error:** `MongoDB connection error: MongoServerError`

**Solution:**
1. Make sure MongoDB is running: `mongod --version`
2. Check MONGO_URI in `.env` file
3. Try connecting manually: `mongosh mongodb://localhost:27017/dfood`

### Issue 2: Backend Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000     # Windows
lsof -i :5000                    # Mac/Linux

# Kill the process
taskkill /PID <PID> /F          # Windows
kill -9 <PID>                    # Mac/Linux
```

### Issue 3: Frontend Can't Connect to Backend
**Error:** `ERR_NETWORK` or CORS errors

**Solution:**
1. Make sure backend is running on port 5000
2. Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
3. Clear browser cache and reload

### Issue 4: Tailwind Styles Not Loading
**Solution:**
```bash
cd frontend
npm install -D tailwindcss @tailwindcss/postcss
npm run dev
```

### Issue 5: Module Not Found Errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 API Endpoints

### Public Routes
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Protected User Routes (Requires Token)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `GET /api/wishlist` - Get wishlist
- `POST /api/orders` - Create order

### Admin Routes (Requires Admin Token)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/upload` - Upload products via CSV

---

## 🎨 Features

### User Features
✅ User registration and login
✅ Browse products with filters
✅ Product search and sorting
✅ Shopping cart
✅ Wishlist
✅ Order placement
✅ User profile management

### Admin Features
✅ Admin dashboard
✅ User management
✅ Product CRUD operations
✅ CSV product upload
✅ Inventory management
✅ Order management

### UI/UX Features
✅ Responsive design
✅ Smooth animations (Framer Motion)
✅ Toast notifications
✅ Loading states
✅ Error handling
✅ Modern gradient design

---

## 🔒 Security Notes

1. **Change Default Credentials**: 
   - Change JWT_SECRET in production
   - Change default admin password immediately

2. **Environment Files**: 
   - Never commit `.env` files to git
   - Use different secrets for dev/staging/production

3. **Database**: 
   - Use authentication in production
   - Whitelist IP addresses

4. **API Rate Limiting**: 
   - Consider adding rate limiting middleware
   - Implement CAPTCHA for public endpoints

---

## 📚 Technologies Used

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- Stripe for payments

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Redux Toolkit (user state)
- Zustand (cart state)
- Framer Motion (animations)
- Axios (HTTP client)
- React Hot Toast (notifications)

---

## 🤝 Support

If you encounter any issues:
1. Check `ANALYSIS_AND_FIXES.md` for detailed error information
2. Make sure all dependencies are installed
3. Verify environment variables are set correctly
4. Check MongoDB is running
5. Clear node_modules and reinstall if needed

---

## 📄 License

This project is for educational purposes.

---

**Happy Coding! 🎉**

