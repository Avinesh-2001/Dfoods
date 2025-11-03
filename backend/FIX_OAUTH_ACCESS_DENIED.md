# 🔧 Fix: OAuth Access Denied Error

## Problem
You're seeing: "Error 403: access_denied" because the OAuth consent screen is in "Testing" mode.

## Solution: Add Yourself as a Test User

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project: **Dfoods** (or dfoods-477119)

### Step 2: Open OAuth Consent Screen
1. Go to: **APIs & Services** → **OAuth consent screen**
2. Or direct link: https://console.cloud.google.com/apis/credentials/consent

### Step 3: Add Test Users
1. Scroll down to **"Test users"** section
2. Click **"+ ADD USERS"** button
3. Add these email addresses:
   - `avijangid7011@gmail.com`
   - `abhishek020621@gmail.com` (if you want to use this too)
4. Click **"ADD"**
5. Click **"SAVE"** at the bottom of the page

### Step 4: Try Authorization Again
After adding test users, wait 1-2 minutes, then try the authorization URL again:
```
https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.send&prompt=consent&response_type=code&client_id=435536199150-45qkuagjh5ou7hudabjestbgfbaff7nk.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fdfoods.onrender.com%2Foauth2callback
```

## Alternative: Publish Your App (Not Recommended for Testing)

If you want anyone to be able to authorize (not just test users):

1. Go to OAuth consent screen
2. Click **"PUBLISH APP"** button
3. Confirm the publishing
4. **Note**: This requires your app to go through Google verification if you use sensitive scopes

**For now, just add test users - it's faster and easier!**

## Quick Steps Summary

1. ✅ Go to: https://console.cloud.google.com/apis/credentials/consent
2. ✅ Scroll to "Test users" section
3. ✅ Click "+ ADD USERS"
4. ✅ Add: `avijangid7011@gmail.com`
5. ✅ Click "SAVE"
6. ✅ Wait 1-2 minutes
7. ✅ Try authorization URL again

---

**That's it!** After adding yourself as a test user, the authorization will work.

