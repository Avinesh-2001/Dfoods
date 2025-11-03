# 📧 Gmail OAuth2 Setup Guide

This guide will help you set up Gmail API OAuth2 authentication for sending emails through your Render backend.

## ✅ What You've Already Done

1. ✅ Created Google Cloud Project (Dfoods)
2. ✅ Set User Type: External
3. ✅ Created OAuth 2.0 Client with:
   - Frontend: https://dfood-project.vercel.app
   - Backend: https://dfoods.onrender.com
4. ✅ Got Client ID and Client Secret

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

The `googleapis` package has been added to `package.json`. Install it:

```bash
cd backend
npm install
```

### Step 2: Generate Refresh Token

**IMPORTANT:** You need to generate a refresh token ONCE. This token will be used to get access tokens automatically.

1. **Set up your `.env` file** with your Google OAuth credentials:

```env
# Gmail OAuth2 Configuration
GMAIL_CLIENT_ID=YOUR_CLIENT_ID_HERE
GMAIL_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GMAIL_REDIRECT_URI=https://dfoods.onrender.com
GMAIL_USER=your-email@gmail.com
```

2. **Run the refresh token generator script**:

```bash
cd backend
node scripts/generateGmailRefreshToken.js
```

3. **Follow the prompts**:
   - The script will display a URL
   - Open that URL in your browser
   - Sign in with the Gmail account you want to send emails from
   - Click "Allow" to authorize the app
   - Copy the authorization code from the URL
   - Paste it into the terminal

4. **Copy the refresh token**:
   - The script will output your `GMAIL_REFRESH_TOKEN`
   - Add it to your `.env` file

### Step 3: Configure Environment Variables

Add all these to your `.env` file (and Render environment variables):

```env
# Gmail OAuth2 Configuration
GMAIL_CLIENT_ID=435536199150-45qkuagjh5ou7hudabjestbgfbaff7nk.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=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
GMAIL_REFRESH_TOKEN=your_refresh_token_here
GMAIL_REDIRECT_URI=https://dfoods.onrender.com
GMAIL_USER=your-email@gmail.com

# Optional: Keep SendGrid as fallback (remove if using only Gmail)
# SENDGRID_API_KEY=your_sendgrid_key
# FROM_EMAIL=your-email@gmail.com
```

### Step 4: Deploy to Render

1. **Add environment variables to Render**:
   - Go to your Render dashboard
   - Select your backend service
   - Go to "Environment" tab
   - Add all the Gmail OAuth2 variables:
     - `GMAIL_CLIENT_ID`
     - `GMAIL_CLIENT_SECRET`
     - `GMAIL_REFRESH_TOKEN`
     - `GMAIL_REDIRECT_URI`
     - `GMAIL_USER`

2. **Redeploy your service**:
   - Render will automatically redeploy when you save environment variables
   - Or trigger a manual redeploy

### Step 5: Verify Setup

1. **Check logs**:
   - After deployment, check Render logs
   - You should see: `✅ Gmail OAuth2 transporter configured and verified`

2. **Test email sending**:
   - Use the contact form on your website
   - Or test via the admin email interface
   - Check logs for email sending confirmations

## 🔧 How It Works

1. **Gmail OAuth2**: Uses OAuth2 authentication instead of SMTP passwords
2. **Refresh Token**: Generated once, used to get access tokens automatically
3. **Access Tokens**: Automatically refreshed when expired (every hour)
4. **Nodemailer**: Sends emails through Gmail API using OAuth2

## 📋 Gmail API Scopes

The setup uses this scope:
- `https://www.googleapis.com/auth/gmail.send` - Send emails only

## 🔍 Troubleshooting

### Issue: "Refresh token not configured"

**Solution**: Run `node scripts/generateGmailRefreshToken.js` to generate a refresh token.

### Issue: "Access token expired"

**Solution**: The system should auto-refresh. If it doesn't, check:
- `GMAIL_REFRESH_TOKEN` is correct
- `GMAIL_CLIENT_ID` and `GMAIL_CLIENT_SECRET` are correct

### Issue: "Invalid grant"

**Solution**: 
- Your refresh token may have been revoked
- Generate a new refresh token using the script
- Make sure you're using the correct Gmail account

### Issue: "OAuth2 credentials not configured"

**Solution**: 
- Check all environment variables are set in Render
- Verify variable names match exactly (case-sensitive)

### Issue: Emails not sending

**Solution**:
1. Check Render logs for error messages
2. Verify Gmail OAuth2 is configured (look for `✅ Gmail OAuth2 configured`)
3. Test the refresh token generation script again
4. Check Google Cloud Console to ensure OAuth consent screen is approved

## 🔄 Fallback to SendGrid

If Gmail OAuth2 is not configured, the system will automatically fall back to SendGrid (if `SENDGRID_API_KEY` is set). This ensures emails continue to work during migration.

## 📝 Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `GMAIL_CLIENT_ID` | Yes | Google OAuth2 Client ID |
| `GMAIL_CLIENT_SECRET` | Yes | Google OAuth2 Client Secret |
| `GMAIL_REFRESH_TOKEN` | Yes | OAuth2 Refresh Token (generate once) |
| `GMAIL_REDIRECT_URI` | Yes | OAuth2 Redirect URI (must match Google Console) |
| `GMAIL_USER` | Yes | Gmail address to send emails from |

## ✅ Verification Checklist

- [ ] Installed `googleapis` package
- [ ] Generated refresh token using the script
- [ ] Added all environment variables to `.env`
- [ ] Added all environment variables to Render
- [ ] Redeployed backend service
- [ ] Verified logs show Gmail OAuth2 configured
- [ ] Tested sending an email
- [ ] Received test email successfully

## 🎉 Success!

Once configured, all emails (contact forms, order confirmations, etc.) will be sent through Gmail API using OAuth2 authentication. The system will automatically refresh access tokens as needed.

## 📚 Additional Resources

- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Nodemailer OAuth2 Guide](https://nodemailer.com/transports/smtp/)

---

**Note**: The refresh token is long-lived and should be kept secure. Never commit it to version control!

