# ⚡ Dfood Quick Start Guide

Get up and running in 5 minutes!

---

## 🚀 Super Quick Setup (One-Command)

### Windows (PowerShell):
```powershell
cd Dfood
.\setup-env.ps1
cd backend; npm install; cd ..
cd frontend; npm install; cd ..
```

### Mac/Linux (Bash):
```bash
cd Dfood
chmod +x setup-env.sh && ./setup-env.sh
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

---

## 🎯 Start Application (2 Commands)

**Terminal 1 - Backend:**
```bash
cd Dfood/backend
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd Dfood/frontend
npm run dev
```
✅ Frontend running on http://localhost:3000

---

## 🧪 Test It Works

1. **Open Browser:** http://localhost:3000

2. **Test Admin Login:**
   - Click "Sign In"
   - Email: `admin@dfoods.com`
   - Password: `admin123`
   - Should redirect to admin dashboard

3. **Test User Registration:**
   - Click "Sign Up"
   - Fill form and submit
   - Should auto-login

---

## ⚠️ Prerequisites

Before starting, make sure you have:

✅ **Node.js** (v18+)
```bash
node --version  # Should show v18.0.0 or higher
```

✅ **MongoDB** (v6+)
```bash
mongod --version  # Should show version 6.0 or higher
# Start MongoDB if not running:
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

✅ **npm or yarn**
```bash
npm --version
```

---

## 📁 What Gets Created

After setup, your structure will be:

```
Dfood/
├── backend/
│   ├── .env          ← Created by setup script
│   └── node_modules/ ← Created by npm install
│
└── frontend/
    ├── .env.local    ← Created by setup script
    └── node_modules/ ← Created by npm install
```

---

## 🔧 Environment Variables Created

### Backend (.env):
```
MONGO_URI=mongodb://localhost:27017/dfood
JWT_SECRET=dfood_secret_key_2025_change_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

### Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🐛 Quick Troubleshooting

### Problem: MongoDB Connection Error
**Solution:**
```bash
# Check if MongoDB is running
mongosh mongodb://localhost:27017

# If not running, start it:
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Problem: Port 5000 Already in Use
**Solution:**
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### Problem: Port 3000 Already in Use
**Solution:**
Change the port when starting:
```bash
cd frontend
PORT=3001 npm run dev
```

### Problem: Module Not Found
**Solution:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Detailed Guides

For more information, see:

- **[README.md](./README.md)** - Full project overview
- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Detailed setup
- **[ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)** - Environment variables
- **[ANALYSIS_AND_FIXES.md](./ANALYSIS_AND_FIXES.md)** - Code analysis
- **[FIXES_APPLIED.md](./FIXES_APPLIED.md)** - What was fixed

---

## 🎉 You're All Set!

Your Dfood application should now be running at:
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend API: http://localhost:5000
- 👤 Admin Login: admin@dfoods.com / admin123

**Happy coding! 🚀**

