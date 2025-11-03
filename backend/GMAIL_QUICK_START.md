# 🚀 Gmail OAuth2 Quick Start

## Your Google OAuth Credentials

```
Client ID: 435536199150-45qkuagjh5ou7hudabjestbgfbaff7nk.apps.googleusercontent.com
Client Secret: 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
Redirect URI: https://dfoods.onrender.com
```

## ⚡ Quick Setup (3 Steps)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Generate Refresh Token
```bash
# First, add to backend/.env:
GMAIL_CLIENT_ID=435536199150-45qkuagjh5ou7hudabjestbgfbaff7nk.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=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
GMAIL_REDIRECT_URI=https://dfoods.onrender.com
GMAIL_USER=your-email@gmail.com

# Then run:
node scripts/generateGmailRefreshToken.js
```

### 3. Add to Render Environment Variables
Add these to your Render backend service:
```
GMAIL_CLIENT_ID=435536199150-45qkuagjh5ou7hudabjestbgfbaff7nk.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=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
GMAIL_REFRESH_TOKEN=<from step 2>
GMAIL_REDIRECT_URI=https://dfoods.onrender.com
GMAIL_USER=your-email@gmail.com
```

## ✅ That's It!

After redeploying, all emails will be sent via Gmail OAuth2. Check logs for: `✅ Gmail OAuth2 transporter configured and verified`

For detailed instructions, see `GMAIL_OAUTH2_SETUP.md`

