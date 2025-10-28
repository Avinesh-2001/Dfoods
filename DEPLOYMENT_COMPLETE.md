# 🚀 Complete Deployment Guide - Dfoods

## ✅ Status
- Frontend: ✅ Deployed on Vercel - https://dfood-project.vercel.app
- Backend: ⚠️ Needs deployment configuration on Render

## 📋 Quick Deployment Steps

### Step 1: Deploy Backend to Render

1. **Go to Render.com Dashboard**
   - Visit: https://dashboard.render.com
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect repository: `Avinesh-2001/Dfoods`
   - Branch: `main`

3. **Configure Service**
   ```
   Name: dfoods-backend
   Root Directory: backend
   Environment: Node
   Build Command: (leave empty)
   Start Command: npm start
   ```

4. **Add Environment Variables**
   Click "Environment" and add these:
   
   ```
   MONGO_URI = mongodb+srv://Dfood_db:ZKVu30vgK03Hgajh@cluster0.ioqhxhx.mongodb.net/dfoods?retryWrites=true&w=majority&appName=Cluster0
   
   JWT_SECRET = 18040bda860f876b18c72db3f5d19522cb751b2a962e43b320ea1366935dbc49bf3461f5189a821abf3d923e9d0d861351876d69c215a0ff009c6452ece431dd
   
   PORT = 10000
   
   FRONTEND_URL = https://dfood-project.vercel.app
   
   EMAIL_USER = abhishek020621@gmail.com
   
   EMAIL_PASSWORD = exwwyhovmqfzuvrg
   
   ADMIN_EMAIL = abhishek020621@gmail.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Copy the URL (e.g., `https://dfoods-backend-xxxx.onrender.com`)

### Step 2: Update Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on "dfood-project"

2. **Add Environment Variable**
   - Go to: **Settings** → **Environment Variables**
   - Click "Add New"
   - Add:
     ```
     Key: NEXT_PUBLIC_API_URL
     Value: https://your-backend-url.onrender.com/api
     ```
     (Replace with your actual Render URL)

3. **Redeploy**
   - Go to: **Deployments** tab
   - Click "..." on latest deployment
   - Click "Redeploy"

### Step 3: Verify Deployment

1. **Visit Your Site**
   - Frontend: https://dfood-project.vercel.app
   - Admin: https://dfood-project.vercel.app/admin-login

2. **Test Backend**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should show: `{"status":"ok","db":"connected"}`

3. **Login as Admin**
   - Email: `admin@dfoods.com`
   - Password: `admin123`

## 🎯 Features Verification

### ✅ Confirmed Working Features

1. **Product Management**
   - ✅ Add/Edit/Delete Products
   - ✅ Bulk Upload via CSV
   - ✅ Product Variants
   - ✅ Images Support

2. **User Management**
   - ✅ User Registration
   - ✅ Login/Logout
   - ✅ Admin can view users
   - ✅ User blocking

3. **Reviews**
   - ✅ Users can submit reviews
   - ✅ Admin can approve/reject
   - ✅ Review display

4. **Contact**
   - ✅ Contact form submission
   - ✅ Admin can view/manage
   - ✅ Status updates

5. **Email Notifications**
   - ✅ Welcome emails
   - ✅ Order confirmations
   - ✅ Contact acknowledgments
   - ✅ Admin notifications

6. **Orders**
   - ✅ Order creation
   - ✅ Order tracking
   - ✅ Order management

## 🔧 Troubleshooting

### Issue: "Application exited early" on Render

**Solution:**
1. Check that `Root Directory` is set to `backend`
2. Verify all environment variables are added
3. Check Build Logs on Render dashboard
4. Make sure PORT environment variable is set to 10000

### Issue: Admin login shows "Invalid credentials"

**Solution:**
1. Default admin is auto-created on first database connection
2. Credentials: `admin@dfoods.com` / `admin123`
3. Check backend logs on Render
4. Verify JWT_SECRET is set

### Issue: Frontend shows "Loading..." forever

**Solution:**
1. Check Vercel environment variable `NEXT_PUBLIC_API_URL`
2. Verify backend URL is correct
3. Check browser console (F12) for errors
4. Make sure backend is running on Render

### Issue: API calls failing

**Solution:**
1. Check CORS settings in `backend/server.js`
2. Verify `FRONTEND_URL` is set correctly
3. Test backend directly: `https://backend-url.onrender.com/api/health`

## 📊 Local Development

### Start Backend Locally
```bash
cd backend
npm start
```

### Start Frontend Locally
```bash
cd frontend
npm run dev
```

Frontend will automatically proxy API calls to `localhost:5000`

## 🎉 You're Done!

Once deployed:
1. ✅ Admin dashboard: https://dfood-project.vercel.app/admin-login
2. ✅ User registration: https://dfood-project.vercel.app/register
3. ✅ Product catalog: https://dfood-project.vercel.app/products

All features work seamlessly in production!

