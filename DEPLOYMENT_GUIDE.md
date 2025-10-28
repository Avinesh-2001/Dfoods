# Deployment Guide for Dfoods

## Current Status
- ✅ Frontend deployed on Vercel: https://dfood-project.vercel.app/
- ⚠️ Backend needs separate deployment (currently localhost only)

## Steps to Complete Deployment

### 1. Deploy Backend

#### Option A: Deploy to Render (Recommended)
1. Go to https://render.com
2. Sign up/Login
3. Click "New Web Service"
4. Connect your GitHub repository
5. Select the `backend` directory
6. Configure:
   - **Name**: dfoods-backend
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Build Command**: (leave empty or `npm install`)
   
7. Add Environment Variables:
   ```
   MONGO_URI=mongodb+srv://Dfood_db:ZKVu30vgK03Hgajh@cluster0.ioqhxhx.mongodb.net/dfoods?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
   PORT=10000
   FRONTEND_URL=https://dfood-project.vercel.app
   EMAIL_USER=abhishek020621@gmail.com
   EMAIL_PASSWORD=exwwyhovmqfzuvrg
   ADMIN_EMAIL=abhishek020621@gmail.com
   ```

8. Click "Create Web Service"
9. Wait for deployment
10. Copy the URL (e.g., `https://dfoods-backend.onrender.com`)

#### Option B: Deploy to Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Add "GitHub Repo" service
5. Select your repository
6. In Settings → Deploy:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   
7. Add Environment Variables (same as above)
8. Deploy and copy the URL

### 2. Update Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your project (dfood-project)
3. Go to **Settings** → **Environment Variables**
4. Add:
   ```
   Variable Name: NEXT_PUBLIC_API_URL
   Value: https://your-backend-url.com/api
   ```
   (Replace with your actual backend URL from Render/Railway)

5. Click **Save**
6. Go to **Deployments** tab
7. Click the **three dots** → **Redeploy** → **Redeploy**

### 3. Verify Deployment

1. Visit https://dfood-project.vercel.app/
2. Check browser console (F12) for errors
3. Test API calls:
   - Visit https://dfood-project.vercel.app/api/products
   - Should return product data or connection error

## Quick Deploy (One-Line Command)

After setting up backend on Render:

```bash
# In Vercel Dashboard, add environment variable:
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

Then redeploy from Vercel dashboard.

## Troubleshooting

### "Loading..." screen
- **Cause**: Backend not deployed or wrong API URL
- **Fix**: Deploy backend and update `NEXT_PUBLIC_API_URL`

### API calls failing
- Check browser console (F12) for errors
- Verify backend URL is accessible
- Check CORS settings in backend

### Admin login not working
- Verify admin credentials are set in backend
- Check JWT_SECRET is set in backend environment
- Default admin:
  - Email: `admin@dfoods.com`
  - Password: `admin123`

## Files to Check

1. `frontend/next.config.ts` - API rewrite configuration
2. `backend/server.js` - CORS and API routes
3. Vercel environment variables - API URL configuration

## Status Check

✅ Frontend: Deployed on Vercel  
⚠️ Backend: Needs deployment  
⚠️ Database: MongoDB Atlas configured  
⚠️ Email: Gmail SMTP configured  

