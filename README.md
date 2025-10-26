# 🍯 Dfood - Premium Organic Jaggery E-Commerce Platform

A full-stack e-commerce web application for selling organic jaggery products. Built with Next.js 15, React 19, Node.js, Express, and MongoDB.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D6.0.0-green.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Customer Features
- 🛍️ **Product Browsing** - Browse and filter products by category, price, and stock
- 🔍 **Smart Search** - Find products quickly
- 🛒 **Shopping Cart** - Add items to cart with quantity management
- ❤️ **Wishlist** - Save favorite products
- 👤 **User Authentication** - Secure login and registration
- 📦 **Order Management** - Place and track orders
- 💳 **Secure Payments** - Stripe integration
- 📱 **Responsive Design** - Works on all devices

### Admin Features
- 📊 **Dashboard** - Overview of users and products
- 👥 **User Management** - View and manage registered users
- 📦 **Product Management** - Create, read, update, delete products
- 📤 **CSV Upload** - Bulk upload products via CSV
- 📈 **Inventory Management** - Track and update stock levels
- 🔒 **Role-Based Access** - Secure admin-only routes

### Technical Features
- ⚡ **Server-Side Rendering** - Fast page loads with Next.js 15
- 🎨 **Modern UI** - Beautiful design with Tailwind CSS
- 🔄 **Real-time Updates** - State management with Redux & Zustand
- 🎭 **Smooth Animations** - Framer Motion integration
- 🔐 **JWT Authentication** - Secure token-based auth
- 🌐 **RESTful API** - Well-structured backend
- 📝 **TypeScript** - Type-safe frontend code
- 🚀 **Optimized Build** - Production-ready setup

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit + Zustand
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Icons:** Heroicons

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **Payment:** Stripe
- **CSV Parsing:** csv-parser

---

## 🚀 Quick Start

### Prerequisites
```bash
# Check versions
node --version  # Should be >= 18.0.0
npm --version
mongod --version  # Should be >= 6.0.0
```

### 1. Clone & Install
```bash
# Clone repository
git clone <repository-url>
cd Dfood

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Environment Variables
**Follow the detailed guide:** [`ENV_SETUP_GUIDE.md`](./ENV_SETUP_GUIDE.md)

Quick setup:
```bash
# Create backend .env
cd backend
# Create file with: MONGO_URI, JWT_SECRET, PORT, etc.

# Create frontend .env.local
cd ../frontend
# Create file with: NEXT_PUBLIC_API_URL
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### 4. Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Default Admin:** admin@dfoods.com / admin123

---

## 📚 Documentation

- **[Setup Instructions](./SETUP_INSTRUCTIONS.md)** - Detailed setup guide
- **[Environment Setup](./ENV_SETUP_GUIDE.md)** - Environment variables guide
- **[Analysis Report](./ANALYSIS_AND_FIXES.md)** - Code analysis and fixes

---

## 📁 Project Structure

```
Dfood/
├── backend/                    # Node.js Express backend
│   ├── config/                # Configuration files
│   │   └── db.js             # MongoDB connection
│   ├── controllers/           # Route controllers
│   │   ├── adminController.js
│   │   └── reviewController.js
│   ├── middlewares/           # Custom middlewares
│   │   ├── adminAuth.js      # Admin authentication
│   │   └── userAuth.js       # User authentication
│   ├── models/                # Mongoose schemas
│   │   ├── Admin.js
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Wishlist.js
│   │   ├── Review.js
│   │   ├── Category.js
│   │   ├── Subcategory.js
│   │   └── HomeContent.js
│   ├── routes/                # API routes
│   │   ├── userRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── homeRoutes.js
│   │   └── adminDashboardRoutes.js
│   ├── uploads/               # File upload directory
│   ├── server.js              # Express server entry
│   ├── package.json
│   └── .env                   # Environment variables (create this)
│
├── frontend/                   # Next.js React frontend
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── layout.tsx    # Root layout
│   │   │   ├── page.tsx      # Home page
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── admin/
│   │   │   └── rewards/
│   │   ├── components/        # React components
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── CartDrawer.tsx
│   │   │   ├── sections/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── CategoryGrid.tsx
│   │   │   │   ├── WhyChooseUsSection.tsx
│   │   │   │   ├── TestimonialsSection.tsx
│   │   │   │   └── WhatWeDoSection.tsx
│   │   │   ├── ui/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── Carousel.tsx
│   │   │   │   ├── FlipCard.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── SiteLoader.tsx
│   │   │   ├── providers/
│   │   │   │   └── ClientProvider.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── lib/               # Utilities and libraries
│   │   │   ├── api/
│   │   │   │   └── api.ts    # Axios configuration
│   │   │   ├── store/
│   │   │   │   └── cartStore.ts  # Zustand cart store
│   │   │   ├── data/         # Static data
│   │   │   └── utils/
│   │   ├── store/             # Redux store
│   │   │   └── index.ts      # User store
│   │   └── types/             # TypeScript types
│   │       └── index.ts
│   ├── public/                # Static assets
│   │   └── images/
│   ├── tailwind.config.ts     # Tailwind configuration
│   ├── next.config.ts         # Next.js configuration
│   ├── tsconfig.json          # TypeScript configuration
│   ├── package.json
│   └── .env.local             # Environment variables (create this)
│
├── README.md                   # This file
├── SETUP_INSTRUCTIONS.md       # Detailed setup guide
├── ENV_SETUP_GUIDE.md         # Environment setup guide
└── ANALYSIS_AND_FIXES.md      # Code analysis report
```

---

## 🖼️ Screenshots

*(Add screenshots of your application here)*

### Home Page
- Hero section with call-to-action
- Product categories
- Why choose us section
- Customer testimonials

### Products Page
- Product grid with filters
- Category filtering
- Price range filter
- Sorting options

### Admin Dashboard
- User management table
- Product management
- CSV upload
- Inventory tracking

---

## 📡 API Documentation

### Authentication

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login Admin
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@dfoods.com",
  "password": "admin123"
}
```

### Products

#### Get All Products
```http
GET /api/products
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Create Product (Admin)
```http
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Pure Jaggery",
  "sku": "PJ001",
  "category": "plain-jaggery",
  "price": 250,
  "quantity": 100,
  "images": ["https://example.com/image.jpg"]
}
```

### Cart

#### Get User Cart
```http
GET /api/cart
Authorization: Bearer <user-token>
```

#### Add to Cart
```http
POST /api/cart
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 2
}
```

---

## 🧪 Testing

### Test User Account
Create a new user account or use:
- Register at: http://localhost:3000/register

### Test Admin Account
Use the default admin credentials:
- **Email:** admin@dfoods.com
- **Password:** admin123
- **Login at:** http://localhost:3000/login

---

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file

2. **Port Already in Use**
   - Kill process using the port
   - Change PORT in .env

3. **API Network Errors**
   - Verify backend is running
   - Check NEXT_PUBLIC_API_URL in frontend .env.local

4. **Module Not Found**
   - Delete node_modules
   - Run npm install again

See [`SETUP_INSTRUCTIONS.md`](./SETUP_INSTRUCTIONS.md) for detailed troubleshooting.

---

## 🔒 Security

- JWT tokens for authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation
- Error boundary for frontend crashes

**Important:** Change default JWT_SECRET before production deployment!

---

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Update MongoDB to Atlas connection string
3. Deploy backend

### Frontend Deployment (Vercel/Netlify)
1. Update NEXT_PUBLIC_API_URL to production backend
2. Build: `npm run build`
3. Deploy

---

## 📝 License

This project is for educational purposes.

---

## 👥 Authors

- **Developer:** Your Name
- **Company:** Dfoods

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS
- MongoDB for the database
- All open-source contributors

---

## 📞 Support

For support, email support@dfoods.com or raise an issue in the repository.

---

**Made with ❤️ for Dfoods**

