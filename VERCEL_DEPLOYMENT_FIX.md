# 🔧 Fix 502 Error: ROUTER_EXTERNAL_TARGET_ERROR

## Problem
Getting `502 ROUTER_EXTERNAL_TARGET_ERROR` when accessing `/api/test/test-email` on Vercel.

## Root Cause
Vercel is trying to proxy the request to an external backend via `NEXT_PUBLIC_API_URL`, but either:
1. The backend URL is incorrect
2. The backend is not deployed/deployable
3. The rewrite configuration isn't working

## Solutions

### Option 1: Check NEXT_PUBLIC_API_URL (Recommended First)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Check `NEXT_PUBLIC_API_URL` value:
   - If backend is on Render: `https://your-backend.onrender.com`
   - If backend is on Railway: `https://your-backend.railway.app`
   - If backend is on another Vercel project: `https://your-backend.vercel.app`
   - If NO separate backend: Leave it empty or remove it

3. **If you don't have a separate backend deployment:**
   - Delete or leave `NEXT_PUBLIC_API_URL` empty
   - The Next.js app will try to use localhost (won't work in production)
   - You'll need to deploy backend separately OR use serverless functions

### Option 2: Deploy Backend Separately

#### On Render (Free):
1. Go to https://render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables:
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `MONGO_URI`
   - etc.
8. Get the URL (e.g., `https://dfoods-backend.onrender.com`)
9. Set in Vercel: `NEXT_PUBLIC_API_URL=https://dfoods-backend.onrender.com`

#### On Railway (Free):
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select repo → Add Service → Select `backend` folder
4. Add environment variables
5. Get URL and set in Vercel

### Option 3: Use Serverless Function (I've Created This)

I've created a serverless function at `frontend/src/app/api/test/test-email/route.ts` that will:
- Work directly as a Vercel serverless function
- Try to proxy to backend if `NEXT_PUBLIC_API_URL` is set
- Show helpful errors if backend is not reachable

**To use this:**
1. The file is already created
2. Redeploy your Vercel project
3. Access: `https://dfood-project.vercel.app/api/test/test-email`

**Note:** This function still needs the backend email logic OR you need to copy the email sending code into it.

### Option 4: Direct Email in Serverless Function

If you don't want a separate backend, we can add email sending directly to the serverless function using the Vercel environment variables.

---

## Quick Check: What's Your Backend URL?

Answer these:
1. **Do you have a separate backend deployment?** (Render, Railway, etc.)
   - If YES: What's the URL?
   - If NO: We need to create one or use serverless functions

2. **What is `NEXT_PUBLIC_API_URL` set to in Vercel?**
   - Check: Vercel Dashboard → Settings → Environment Variables

---

## Immediate Fix (If No Separate Backend)

If you don't have a backend deployed separately:

1. **Option A:** Deploy backend on Render/Railway (free)
2. **Option B:** Remove `NEXT_PUBLIC_API_URL` from Vercel
3. **Option C:** Use the serverless function I created (needs email logic added)

---

## Recommended Solution

**Best approach: Deploy backend separately on Render**

1. Render.com → New Web Service
2. Connect GitHub repo
3. Root Directory: `backend`
4. Build: `npm install`
5. Start: `npm start`
6. Add all env vars (EMAIL_USER, EMAIL_PASSWORD, MONGO_URI, etc.)
7. Get URL: `https://xxx.onrender.com`
8. Set in Vercel: `NEXT_PUBLIC_API_URL=https://xxx.onrender.com`
9. Redeploy frontend

Then your endpoint will work: `https://dfood-project.vercel.app/api/test/test-email`

---

## Test After Fix

```bash
POST https://dfood-project.vercel.app/api/test/test-email
Content-Type: application/json

{
  "to": "abhishek020621@gmail.com"
}
```

