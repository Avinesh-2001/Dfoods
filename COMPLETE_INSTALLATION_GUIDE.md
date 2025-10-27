# 🚀 Complete Installation Guide - Dfood Email Notification System

## 📋 Prerequisites

### 1. **MongoDB Setup**
```bash
# Install MongoDB Community Edition
# Download from: https://www.mongodb.com/try/download/community
# Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

# Start MongoDB service (Windows)
net start MongoDB

# Or start MongoDB manually
mongod --dbpath C:\data\db
```

### 2. **Node.js Dependencies**
All required packages are already installed:
- ✅ `nodemailer` - For email sending
- ✅ `mongoose` - For database operations
- ✅ `cors` - For cross-origin requests
- ✅ `bcryptjs` - For password hashing
- ✅ `jsonwebtoken` - For authentication

## 🔧 Environment Setup

### 1. **Backend Environment (.env file)**
Create `backend/.env` file with:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/dfood

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 2. **Gmail App Password Setup**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Factor Authentication**
3. Go to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "Dfood App" as the name
6. Copy the generated 16-character password
7. Use this password as `EMAIL_PASS` in your .env file

## 🚀 Installation Steps

### Step 1: Start MongoDB
```bash
# Option 1: Start MongoDB service (Windows)
net start MongoDB

# Option 2: Start MongoDB manually
mongod --dbpath C:\data\db

# Option 3: Use MongoDB Atlas (cloud)
# Just update MONGODB_URI in .env file
```

### Step 2: Install Dependencies
```bash
# Backend dependencies (already done)
cd backend
npm install

# Frontend dependencies (already done)
cd ../frontend
npm install
```

### Step 3: Initialize Email Templates
```bash
# Start your backend server first
cd backend
npm start

# In another terminal, run the initialization script
node scripts/initializeEmailTemplates.js
```

### Step 4: Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📧 Email System Features

### **1. OTP Verification System**
- ✅ User registration requires OTP verification
- ✅ 6-digit OTP sent via email
- ✅ 5-minute expiration
- ✅ 3-attempt limit
- ✅ Resend functionality

### **2. Email Template Management**
- ✅ 25+ pre-built email templates
- ✅ 6 categories of emails
- ✅ Variable support ({{user_name}}, {{order_id}}, etc.)
- ✅ HTML email templates
- ✅ Active/Inactive status
- ✅ Live preview

### **3. Email Categories**

#### **👤 Account / User Emails**
- Create Account
- OTP Verification
- Welcome Email
- Forgot Password

#### **🎯 Discount / Marketing Emails**
- Discount Notification
- Greeting Shopping Again

#### **🛒 Checkout / Order Emails**
- Checkout Pending
- Payment Success
- Order Confirmation
- Order Invoice
- Order Edited
- Order Canceled

#### **🚚 Shipping Emails**
- Shipping Confirmation
- Pick Up Order
- Out for Delivery
- Delivered Order
- Shipping Updated

#### **💳 Payment Emails**
- Payment Error
- Payment Success
- Payment Reminder

#### **↩️ Return Emails**
- Return Created
- Return Received
- Return Approved
- Return Declined

## 🎯 How to Use

### **For Users:**
1. Go to `/register`
2. Fill registration form
3. Receive OTP via email
4. Enter OTP to verify account
5. Account created successfully!

### **For Admins:**
1. Go to `/admin-login`
2. Login with admin credentials
3. Navigate to "Email Notifications"
4. Manage email templates
5. Edit, preview, activate/deactivate templates

## 🔍 Testing the System

### **1. Test OTP Registration:**
1. Go to `http://localhost:3000/register`
2. Fill in the registration form
3. Check your email for OTP
4. Enter the OTP to complete registration

### **2. Test Email Templates:**
1. Go to `http://localhost:3000/admin-login`
2. Login with admin credentials
3. Go to "Email Notifications"
4. Click "Edit" on any template
5. Preview the template
6. Test sending emails

### **3. Test Email Sending:**
```javascript
// Example API call to send email
POST /api/admin/emails/send
{
  "templateName": "Welcome Email",
  "recipientEmail": "user@example.com",
  "variables": {
    "user_name": "John Doe",
    "frontend_url": "http://localhost:3000"
  }
}
```

## 🛠️ Troubleshooting

### **Email Not Sending:**
1. ✅ Check EMAIL_USER and EMAIL_PASS in .env
2. ✅ Ensure 2FA is enabled on Gmail
3. ✅ Use App Password, not regular password
4. ✅ Check console logs for errors
5. ✅ Verify internet connection

### **MongoDB Connection Issues:**
1. ✅ Start MongoDB service
2. ✅ Check MONGODB_URI in .env
3. ✅ Ensure MongoDB is running on port 27017
4. ✅ Check firewall settings

### **OTP Not Working:**
1. ✅ Check email configuration
2. ✅ Verify OTP routes are working
3. ✅ Check console logs for errors
4. ✅ Ensure email templates are initialized

## 📱 API Endpoints

### **OTP Endpoints:**
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP

### **Email Template Endpoints:**
- `GET /api/admin/emails/templates` - Get all templates
- `POST /api/admin/emails/templates` - Create template
- `PUT /api/admin/emails/templates/:id` - Update template
- `DELETE /api/admin/emails/templates/:id` - Delete template

### **Email Sending Endpoints:**
- `POST /api/admin/emails/send` - Send email using template
- `POST /api/admin/emails/send-welcome` - Send welcome email
- `POST /api/admin/emails/send-order-confirmation` - Send order confirmation
- `POST /api/admin/emails/send-shipping-confirmation` - Send shipping confirmation
- `POST /api/admin/emails/send-discount-notification` - Send discount notification

## 🎨 Frontend Components

### **New Components Added:**
- ✅ `OTPVerification.tsx` - OTP verification component
- ✅ `EmailsPage.tsx` - Email template management
- ✅ Updated `RegisterPage.tsx` - OTP integration
- ✅ Updated API routes for email management

### **New Routes:**
- ✅ `/admin-dashboard/emails` - Email management dashboard
- ✅ Updated registration flow with OTP

## 📊 Database Models

### **New Models:**
- ✅ `EmailTemplate.js` - Email template schema
- ✅ Updated `User.js` - OTP verification support

## 🔐 Security Features

- ✅ OTP expiration (5 minutes)
- ✅ Attempt limits (3 tries)
- ✅ Secure token generation
- ✅ Email validation
- ✅ Admin authentication for template management

## 🎉 Success Indicators

When everything is working correctly, you should see:
1. ✅ MongoDB connected successfully
2. ✅ Email templates initialized
3. ✅ OTP emails being sent
4. ✅ Welcome emails working
5. ✅ Admin dashboard accessible
6. ✅ Email templates editable

## 📞 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Check Gmail app password setup
5. Verify network connectivity

Your email notification system is now fully installed and ready to use! 🚀





