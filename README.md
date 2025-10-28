# Dfoods - Complete E-commerce Platform

A full-stack e-commerce platform for selling organic jaggery products with admin dashboard, product management, email notifications, and payment integration.

## 🌟 Features

### User Features
- ✅ User Registration & Login
- ✅ OTP Verification
- ✅ Product Browsing & Filtering
- ✅ Shopping Cart
- ✅ Wishlist
- ✅ Product Reviews
- ✅ Order Management
- ✅ Contact Form
- ✅ Email Notifications

### Admin Features
- ✅ Admin Dashboard with Analytics
- ✅ User Management
- ✅ Product Management (CRUD)
- ✅ Bulk Product Upload via CSV
- ✅ Order Management
- ✅ Review Approval
- ✅ Contact Management
- ✅ Email Template Management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Gmail account for email notifications

### Local Development

#### 1. Clone the Repository
```bash
git clone https://github.com/Avinesh-2001/Dfoods.git
cd Dfoods
```

#### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=your-email@gmail.com
```

**⚠️ Important:** 
- Replace `your_mongodb_atlas_connection_string` with your actual MongoDB connection string
- Get your connection string from MongoDB Atlas → Connect → Connect your application

**Get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Enter "Dfoods App"
4. Copy the 16-character password (no spaces)

#### 3. Start Backend Server

```bash
cd backend
npm start
```

Server will run on http://localhost:5000

#### 4. Setup Frontend

```bash
cd frontend
npm install
```

#### 5. Start Frontend (Development Mode)

```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:3000

#### 6. Access Admin Dashboard

1. Visit: http://localhost:3000/admin-login
2. Login with default credentials:
   - Email: `admin@dfoods.com`
   - Password: `admin123`

## 📦 Deployment

### Deploy Backend to Render.com

1. **Sign up at [Render.com](https://render.com)**
2. **Create New Web Service**
   - Connect your GitHub account
   - Select repository: `Dfoods`
   - Branch: `main`

3. **Configure Service**
   - **Name:** `dfoods-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install` (leave empty)
   - **Start Command:** `npm start`
   - **Environment:** `Node`

4. **Add Environment Variables:**
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_long_random_secret_key
   PORT=10000
   FRONTEND_URL=https://dfood-project.vercel.app
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   ADMIN_EMAIL=your-admin-email@gmail.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the URL (e.g., `https://dfoods-backend.onrender.com`)

### Deploy Frontend to Vercel

1. **Sign up at [Vercel.com](https://vercel.com)**
2. **Import Git Repository**
   - Connect GitHub account
   - Select repository: `Dfoods`
   
3. **Configure Project**
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Next.js`
   
4. **Add Environment Variable:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   ```
   (Replace with your actual Render backend URL)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live!

## 🔧 Configuration

### Admin Credentials

**Default Admin:**
- Email: `admin@dfoods.com`
- Password: `admin123`

To change password, update in `backend/server.js` or create new admin in database.

### File Upload

Backend supports CSV bulk upload for products:
- Template: `sample-products.csv` in root directory
- Max file size: 5MB
- Format: CSV with columns (Name, SKU, Category, Price, Images, etc.)

### Email Configuration

Update email settings in backend `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=your-admin-email@gmail.com
```

### Database

MongoDB Atlas setup:
1. Create account at https://www.mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Add to backend `.env` as `MONGO_URI`

## 📂 Project Structure

```
Dfoods/
├── backend/              # Express.js Backend
│   ├── config/          # Configuration files
│   ├── controllers/     # Controller logic
│   ├── middlewares/     # Auth & validation
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── uploads/         # Uploaded files
│   ├── server.js        # Main server file
│   └── package.json     # Backend dependencies
│
├── frontend/            # Next.js Frontend
│   ├── src/
│   │   ├── app/         # Next.js 13+ app directory
│   │   ├── components/  # React components
│   │   ├── lib/         # Utilities & API
│   │   └── types/       # TypeScript types
│   ├── public/          # Static assets
│   └── package.json     # Frontend dependencies
│
└── README.md            # This file
```

## 🛠️ API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `POST /api/auth/otp/send-otp` - Send OTP
- `POST /api/contact/submit` - Submit contact form

### Admin Endpoints (Auth Required)
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/dashboard/users` - Get users
- `GET /api/admin/dashboard/products` - Get products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/upload` - Upload CSV

See `backend/routes/` for complete API documentation.

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify environment variables
- Check if port 5000 is available

### Frontend shows "Loading..." forever
- Check if backend is running
- Verify CORS settings
- Check browser console for errors

### Admin login fails
- Verify admin credentials in database
- Check JWT_SECRET is set
- Clear browser localStorage

### Email not sending
- Verify Gmail App Password
- Check email credentials in .env
- Check spam folder

### Deployment issues on Render
- Verify root directory is `backend`
- Check all environment variables are set
- Review Render logs for errors

## 📝 License

This project is proprietary and confidential.

## 👥 Contact

For support, contact: abhishek020621@gmail.com

---

**Happy Coding! 🚀**
