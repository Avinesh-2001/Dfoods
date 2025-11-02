# 📧 Email Not Receiving - Troubleshooting Guide

## Quick Diagnosis

### 1. Check Your `.env` File

**Location:** `backend/.env` (must be in the backend folder)

**Required Variables:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
FRONTEND_URL=https://dfoods.in
ADMIN_EMAIL=abhishek020621@gmail.com
```

### 2. Verify Environment Variable Names

⚠️ **IMPORTANT:** The code uses:
- `EMAIL_USER` ✅ (not EMAIL_ADDRESS or EMAIL)
- `EMAIL_PASSWORD` ✅ (not EMAIL_PASS or EMAIL_PWD)

### 3. Get Gmail App Password

**Steps:**
1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not enabled)
3. Go to: https://myaccount.google.com/apppasswords
4. Select:
   - App: **Mail**
   - Device: **Other (Custom name)**
   - Name: **Dfoods Backend**
5. Click **Generate**
6. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)
7. **Remove ALL spaces** when pasting into `.env`
   - ✅ Correct: `EMAIL_PASSWORD=abcdefghijklmnop`
   - ❌ Wrong: `EMAIL_PASSWORD=abcd efgh ijkl mnop`

### 4. Check Backend Console

**When you try to register, check backend console for:**

**✅ Success looks like:**
```
📧 Attempting to send email to: user@example.com
✅ Email sent successfully → To: user@example.com | Subject: Verify Your Email - Dfood
📬 Message ID: <some-id>
📬 Response: 250 2.0.0 OK
```

**❌ Error looks like:**
```
❌ Error sending email to user@example.com: Invalid login
❌ Error code: EAUTH
```

### 5. Common Errors & Fixes

#### Error: "EMAIL_USER or EMAIL_PASSWORD not configured"
**Fix:** Check your `.env` file has both variables set

#### Error: "Invalid login" or "EAUTH"
**Fix:** 
- Use App Password, not regular password
- Remove spaces from App Password
- Regenerate App Password if needed

#### Error: "Connection timeout"
**Fix:**
- Check internet connection
- Check firewall settings
- Try different network

#### No Error, But No Email Received
**Fix:**
- Check **Spam/Junk folder**
- Wait 1-2 minutes (email delivery can be delayed)
- Check backend logs for "Email sent successfully"
- Verify email address is correct

### 6. Test Email Configuration

**Method 1: Check Backend Startup**
When you start the backend, you should see:
```
✅ Email transporter is ready to send emails
```

If you see:
```
⚠️ Email configuration warning: [error]
```
Then your credentials are wrong.

**Method 2: Check Registration Flow**
1. Try to register a new account
2. Watch backend console
3. Look for email sending logs

### 7. Production Environment (Render/Vercel)

If deployed, environment variables must be set in:

**Render:**
- Dashboard → Your Service → Environment → Add Variables

**Vercel:**
- Dashboard → Project → Settings → Environment Variables

**⚠️ After adding variables, restart your service!**

### 8. FRONTEND_URL in .env

The `FRONTEND_URL` in `.env` is used for:
- Welcome email links
- Password reset links
- Other email links

**Set it to:**
- Local: `http://localhost:3000`
- Production: `https://dfoods.in` (or your domain)

### 9. Verify .env File Format

**Correct format:**
```env
EMAIL_USER=myemail@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
FRONTEND_URL=https://dfoods.in
ADMIN_EMAIL=abhishek020621@gmail.com
```

**❌ Common mistakes:**
- Using quotes: `EMAIL_USER="myemail@gmail.com"` ❌
- Extra spaces: `EMAIL_USER = myemail@gmail.com` ❌
- Missing = sign: `EMAIL_USER myemail@gmail.com` ❌

### 10. Still Not Working?

**Debug Steps:**
1. ✅ Check `.env` file exists in `backend` folder
2. ✅ Verify variable names (EMAIL_USER, EMAIL_PASSWORD)
3. ✅ Confirm App Password (16 characters, no spaces)
4. ✅ Restart backend server after .env changes
5. ✅ Check backend console for error messages
6. ✅ Check Spam/Junk folder
7. ✅ Try different email address
8. ✅ Verify 2FA is enabled on Google account

**Share these for help:**
- Backend console error messages
- Your `.env` structure (hide actual passwords)
- Whether you're on localhost or production

