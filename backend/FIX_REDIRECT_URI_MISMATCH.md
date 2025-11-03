# 🔧 Fix: Redirect URI Mismatch Error

## Problem
**Error 400: redirect_uri_mismatch**

The redirect URI in the authorization URL doesn't match what's configured in Google Cloud Console.

## Solution: Update Redirect URI in Google Cloud Console

### Step 1: Go to OAuth 2.0 Client Settings
1. Visit: https://console.cloud.google.com/apis/credentials?project=dfoods-477119
2. Find your OAuth 2.0 Client ID: `435536199150-45qkuagjh5ou7hudabjestbgfbaff7nk.apps.googleusercontent.com`
3. Click on it to edit

### Step 2: Add the Correct Redirect URI
In the "Authorized redirect URIs" section, make sure you have BOTH:

```
https://dfoods.onrender.com
https://dfoods.onrender.com/oauth2callback
```

**Important**: Add BOTH URLs:
- `https://dfoods.onrender.com` (base URL)
- `https://dfoods.onrender.com/oauth2callback` (callback endpoint)

### Step 3: Save
Click **"SAVE"** at the bottom

### Step 4: Add Test User (if not done already)
1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=dfoods-477119
2. Scroll to "Test users" section
3. Click "+ ADD USERS"
4. Add: `avijangid7011@gmail.com`
5. Click "SAVE"

### Step 5: Try Authorization Again
Wait 1-2 minutes, then use this URL:
```
https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.send&prompt=consent&response_type=code&client_id=435536199150-45qkuagjh5ou7hudabjestbgfbaff7nk.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fdfoods.onrender.com%2Foauth2callback
```

## Quick Checklist

- [ ] Go to Google Cloud Console → APIs & Services → Credentials
- [ ] Click on your OAuth 2.0 Client ID
- [ ] Add `https://dfoods.onrender.com/oauth2callback` to Authorized redirect URIs
- [ ] Keep `https://dfoods.onrender.com` as well (if it exists)
- [ ] Click SAVE
- [ ] Add `avijangid7011@gmail.com` as test user (if not done)
- [ ] Wait 1-2 minutes
- [ ] Try authorization URL again

---

**That's it!** After updating the redirect URI, the authorization will work.

