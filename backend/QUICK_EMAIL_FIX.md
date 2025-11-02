# 🚨 QUICK FIX: OTP Email Not Working

## Immediate Steps to Fix

### Step 1: Check Your .env File Location
Your `.env` file MUST be in the `backend/` folder:

```
Dfoods/
  └── backend/
      ├── .env          ← MUST BE HERE (same folder as server.js)
      ├── server.js
      └── ...
```

### Step 2: Create/Edit backend/.env File

Open `backend/.env` and add these lines (NO QUOTES, NO SPACES):

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your16characterapppassword
```

**IMPORTANT:**
- ❌ NO quotes: `EMAIL_USER="your-email@gmail.com"` ❌
- ✅ NO quotes: `EMAIL_USER=your-email@gmail.com` ✅
- ❌ NO spaces in password: `abcd efgh ijkl mnop` ❌
- ✅ NO spaces: `abcdefghijklmnop` ✅

### Step 3: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. If prompted, enable **2-Step Verification** first
3. Select app: **Mail**
4. Select device: **Other (Custom name)** → Type "Dfoods"
5. Click **Generate**
6. Copy the 16-character password (remove spaces if shown)
7. Paste into `.env` as `EMAIL_PASSWORD`

### Step 4: Restart Backend Server

**CRITICAL:** You MUST restart your backend server after editing `.env`!

```bash
# Stop the server (Ctrl+C)
# Then start again
cd backend
npm start
```

### Step 5: Check Backend Console

When you start the server, you should see:

```
📧 Email Configuration Check:
   EMAIL_USER: ✅ Set (your-email@gmail.com)
   EMAIL_PASSWORD: ✅ Set (16 chars)
✅ Email credentials found in environment

✅ ============================================
✅ Email transporter verified and ready!
✅ ============================================
```

If you see ❌, go back to Step 2 and check your `.env` file.

### Step 6: Test Email Configuration

**Option A: Use the Test Endpoint**

```bash
POST http://localhost:5000/api/test/test-email
Content-Type: application/json

{
  "to": "your-test-email@gmail.com"
}
```

**Option B: Check Config Status**

```bash
GET http://localhost:5000/api/test/email-config-status
```

### Step 7: Check OTP is Generated

Even if email fails, the OTP is always generated and shown in backend console:

```
✅ OTP generated for user@email.com: 123456
```

You can use this OTP to proceed with registration while fixing email.

## Common Issues

### Issue: "EMAIL_USER or EMAIL_PASSWORD not configured"
**Solution:**
- ✅ Check `.env` file is in `backend/` folder
- ✅ Check variable names are exact: `EMAIL_USER` and `EMAIL_PASSWORD`
- ✅ Check NO quotes around values
- ✅ **RESTART backend server** after editing `.env`

### Issue: "EAUTH" Error (Authentication failed)
**Solution:**
- ✅ Use App Password, NOT regular password
- ✅ Enable 2-Step Verification
- ✅ Remove all spaces from App Password
- ✅ Regenerate App Password if needed

### Issue: Email goes to Spam
**Solution:**
- ✅ Check spam/junk folder
- ✅ Mark as "Not Spam"
- ✅ Add sender to contacts

## Still Not Working?

1. **Check backend console logs** when user requests OTP
2. **Use test endpoint**: `/api/test/test-email` to test email separately
3. **Verify .env location**: Must be in `backend/` folder
4. **Check OTP in console**: OTP is always logged even if email fails

## Quick Checklist

- [ ] `.env` file exists in `backend/` folder
- [ ] `EMAIL_USER` = your full Gmail (no quotes)
- [ ] `EMAIL_PASSWORD` = 16-char App Password (no spaces, no quotes)
- [ ] 2-Step Verification enabled on Google Account
- [ ] App Password generated for "Mail"
- [ ] **Backend server RESTARTED** after editing `.env`
- [ ] Test endpoint works: `/api/test/test-email`
- [ ] Check spam folder if email not received

## Need More Help?

Check the detailed guide: `backend/EMAIL_SETUP_COMPLETE_GUIDE.md`

