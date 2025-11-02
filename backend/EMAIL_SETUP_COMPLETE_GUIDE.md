# 📧 Email Setup Complete Guide - Fix OTP Not Receiving Issue

## Step 1: Check Your .env File Location
Your `.env` file MUST be in the `backend/` folder (same folder as `server.js`)

```
Dfoods/
  └── backend/
      ├── .env          ← MUST BE HERE
      ├── server.js
      └── ...
```

## Step 2: Create/Update Your .env File

Open `backend/.env` and add these lines (replace with your actual values):

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**IMPORTANT:**
- ✅ NO quotes around values
- ✅ NO spaces in App Password
- ✅ Use Gmail App Password (NOT your regular Gmail password)

## Step 3: Create Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App Passwords** section
4. Select app: **Mail**
5. Select device: **Other (Custom name)** → Type "Dfoods Backend"
6. Click **Generate**
7. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)
8. **Remove all spaces** → Final: `abcdefghijklmnop`
9. Paste into `.env` file as `EMAIL_PASSWORD`

## Step 4: Test Email Configuration

### Option A: Using the Test Endpoint

1. Start your backend server
2. Open terminal/Postman and send a POST request:

```bash
POST http://localhost:5000/api/test/test-email
Content-Type: application/json

{
  "to": "your-test-email@gmail.com"
}
```

Or use curl:
```bash
curl -X POST http://localhost:5000/api/test/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-test-email@gmail.com"}'
```

### Option B: Check Config Status

```bash
GET http://localhost:5000/api/test/email-config-status
```

## Step 5: Check Backend Console Logs

When you start your backend, you should see:

```
📧 Email Configuration Check:
   EMAIL_USER: ✅ Set (your-email@gmail.com)
   EMAIL_PASSWORD: ✅ Set (16 chars)
✅ Email credentials found in environment

✅ ============================================
✅ Email transporter verified and ready!
✅ ============================================
```

If you see ❌, your `.env` file is not configured correctly.

## Step 6: Common Issues & Solutions

### Issue 1: "EMAIL_USER or EMAIL_PASSWORD not configured"
**Solution:**
- Check `.env` file is in `backend/` folder
- Check variable names are exactly `EMAIL_USER` and `EMAIL_PASSWORD`
- Check no extra spaces or quotes
- Restart your backend server after editing `.env`

### Issue 2: "EAUTH" Error (Authentication failed)
**Solution:**
- Use App Password, NOT regular password
- Make sure 2-Step Verification is enabled
- Remove spaces from App Password
- Regenerate App Password if old one doesn't work

### Issue 3: "ECONNECTION" Error
**Solution:**
- Check internet connection
- Gmail SMTP may be blocked by firewall
- Try using a VPN or different network

### Issue 4: Email goes to Spam
**Solution:**
- Check spam/junk folder
- Mark as "Not Spam"
- Add sender to contacts

### Issue 5: Still not working after all steps
**Solution:**
1. Check backend console logs when sending OTP
2. Look for error messages
3. Try the test endpoint first: `/api/test/test-email`
4. Check OTP in console (it's logged even if email fails)

## Step 7: Verify OTP is Generated (Even if Email Fails)

Check your backend console when user requests OTP. You should see:

```
✅ OTP generated for user@email.com: 123456
🔐 OTP stored in memory. Expires in 5 minutes.
```

Even if email fails, the OTP is still valid and can be used from the console.

## Still Having Issues?

1. **Check Backend Logs:** Look for detailed error messages
2. **Use Test Endpoint:** Test email sending separately from OTP
3. **Verify .env:** Use `/api/test/email-config-status` endpoint
4. **Check OTP Console:** OTP is always logged in backend console

## Quick Checklist

- [ ] `.env` file in `backend/` folder
- [ ] `EMAIL_USER` = your full Gmail address
- [ ] `EMAIL_PASSWORD` = 16-char Gmail App Password (no spaces)
- [ ] 2-Step Verification enabled on Google Account
- [ ] App Password generated for "Mail"
- [ ] Backend server restarted after editing `.env`
- [ ] Test endpoint works: `/api/test/test-email`
- [ ] Check spam folder if email not received

