# Environment Setup Guide

## 🔧 Required Environment Files

You need to create `.env` files for both backend and frontend. These files are not tracked in git for security reasons.

---

## Backend Environment File

**Location:** `Dfood/backend/.env`

**Create the file manually and add:**

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/dfood

# JWT Secret Key (Change this in production!)
JWT_SECRET=dfood_secret_key_2025_change_in_production

# Server Port
PORT=5000

# Environment
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Stripe Secret Key (Get from https://stripe.com/docs/keys)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

### Quick Create (Copy & Paste in Terminal):

**Windows (PowerShell):**
```powershell
cd Dfood\backend
@"
MONGO_URI=mongodb://localhost:27017/dfood
JWT_SECRET=dfood_secret_key_2025_change_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key_here
"@ | Out-File -FilePath .env -Encoding utf8
```

**Mac/Linux (Bash):**
```bash
cd Dfood/backend
cat > .env << 'EOF'
MONGO_URI=mongodb://localhost:27017/dfood
JWT_SECRET=dfood_secret_key_2025_change_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key_here
EOF
```

---

## Frontend Environment File

**Location:** `Dfood/frontend/.env.local`

**Create the file manually and add:**

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Quick Create (Copy & Paste in Terminal):

**Windows (PowerShell):**
```powershell
cd Dfood\frontend
@"
NEXT_PUBLIC_API_URL=http://localhost:5000/api
"@ | Out-File -FilePath .env.local -Encoding utf8
```

**Mac/Linux (Bash):**
```bash
cd Dfood/frontend
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF
```

---

## ⚠️ Important Notes

1. **Never commit `.env` files** to version control
2. **Change JWT_SECRET** before deploying to production
3. **Get a real Stripe key** if you want to test payments
4. **Use MongoDB Atlas** connection string for cloud deployment

---

## ✅ Verify Setup

After creating the files, verify they exist:

**Windows:**
```powershell
dir Dfood\backend\.env
dir Dfood\frontend\.env.local
```

**Mac/Linux:**
```bash
ls -la Dfood/backend/.env
ls -la Dfood/frontend/.env.local
```

You should see both files listed.

---

## 🚀 Next Steps

After creating environment files, proceed to `SETUP_INSTRUCTIONS.md` for running the application.

