# ⚠️ Google Verification Warning - How to Proceed

## The Warning You're Seeing

**"Google hasn't verified this app"**

This is normal for apps in testing mode. You can proceed safely since you're the developer.

## How to Continue (2 Steps)

### Step 1: Click "Advanced"
At the bottom of the warning screen, click the **"Advanced"** link.

### Step 2: Click "Go to Dfoods (unsafe)"
After clicking "Advanced", you'll see an option like:
- **"Go to Dfoods (unsafe)"** or
- **"Continue to Dfoods"** or
- **"Proceed anyway"**

Click that button to continue.

## What Happens Next

1. You'll see the permission screen asking to "Send email on your behalf"
2. Click **"Allow"**
3. You'll be redirected to `https://dfoods.onrender.com/oauth2callback`
4. The page will display your **GMAIL_REFRESH_TOKEN**
5. Copy the token!

## Why This Warning Appears

- Your app is in **"Testing"** mode
- It requests a **sensitive scope** (Gmail send)
- Google shows this warning for security
- **It's safe to proceed** since you're the developer

## For Production (Later)

If you want to remove this warning for all users:
1. Go to Google Cloud Console → OAuth consent screen
2. Click **"PUBLISH APP"**
3. Submit for verification (can take several days)
4. Once verified, the warning disappears

**For now, just click "Advanced" → "Go to Dfoods (unsafe)" and continue!**

---

## Quick Steps Summary

1. ✅ See warning screen
2. ✅ Click **"Advanced"** (at bottom)
3. ✅ Click **"Go to Dfoods (unsafe)"**
4. ✅ Click **"Allow"** on permissions screen
5. ✅ Get your refresh token!

