# Email Not Receiving - Fix Guide

## Quick Check

1. **Run the diagnostic script:**
   ```bash
   cd backend
   node check-email-config.js
   ```

2. **Check your backend console logs** when sending OTP - you should see:
   - `📧 Attempting to send email to: [email]`
   - `✅ Email sent successfully` OR `❌ Error sending email`

## Common Issues & Fixes

### Issue 1: Missing Environment Variables

**Check your `.env` file in the `backend` folder:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
FRONTEND_URL=https://dfoods.in  # or your frontend URL
ADMIN_EMAIL=abhishek020621@gmail.com
```

**⚠️ Important:** 
- Use `EMAIL_PASSWORD` (not `EMAIL_PASS`)
- The password must be a **Gmail App Password**, not your regular password
- Remove all spaces from the App Password

### Issue 2: Gmail App Password Not Set Up

**Steps to create App Password:**

1. Go to https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** (if not already enabled)
4. After enabling 2-Step Verification, go to **App passwords**:
   - Scroll down to "Signing in to Google"
   - Click on **App passwords**
5. Generate new App Password:
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter: **Dfoods Backend**
   - Click **Generate**
6. Copy the 16-character password (no spaces)
7. Paste it in your `.env` file as `EMAIL_PASSWORD`

**Example:**
```
EMAIL_PASSWORD=abcdefghijklmnop
```

### Issue 3: Wrong Email Service Configuration

If you're using Gmail, the current config should work. But verify in `backend/utils/mailers.js`:
- Service is set to `'gmail'`
- Using `EMAIL_USER` and `EMAIL_PASSWORD`

### Issue 4: Emails Going to Spam

- Check your **Spam/Junk folder**
- Mark Dfoods emails as **Not Spam**
- Add sender to contacts if possible

### Issue 5: Backend Not Restarted After .env Change

**After changing `.env` file:**
1. Stop your backend server (Ctrl+C)
2. Restart the backend server
3. Check console for: `✅ Email transporter is ready to send emails`

### Issue 6: Production Environment (Render/Vercel)

**If deployed on Render or Vercel:**

1. **Render:**
   - Go to your Render dashboard
   - Select your backend service
   - Go to **Environment** tab
   - Add/Update:
     - `EMAIL_USER=your-email@gmail.com`
     - `EMAIL_PASSWORD=your-app-password`
     - `FRONTEND_URL=https://dfoods.in`

2. **Vercel:**
   - Go to Vercel dashboard
   - Select your project
   - Go to **Settings** > **Environment Variables**
   - Add/Update the same variables

3. **Restart the service** after adding environment variables

## Testing Email Configuration

### Method 1: Run Diagnostic Script
```bash
cd backend
node check-email-config.js
```

### Method 2: Check Backend Logs

When you try to register, watch your backend console for:

**✅ Success:**
```
📧 Attempting to send email to: user@example.com
✅ Email sent successfully → To: user@example.com
📬 Message ID: <message-id>
```

**❌ Error:**
```
❌ Error sending email: [error message]
❌ Error code: [code]
```

## Quick Verification Checklist

- [ ] `.env` file exists in `backend` folder
- [ ] `EMAIL_USER` is set to your Gmail address
- [ ] `EMAIL_PASSWORD` is set to a 16-character App Password
- [ ] No spaces in App Password
- [ ] 2FA is enabled on Google account
- [ ] App Password was generated correctly
- [ ] Backend server was restarted after .env changes
- [ ] Check Spam/Junk folder
- [ ] Backend console shows "Email transporter is ready"

## Still Not Working?

1. **Check backend logs** - Look for error messages
2. **Run diagnostic:** `node backend/check-email-config.js`
3. **Verify Gmail settings:**
   - Go to https://myaccount.google.com/security
   - Check if App Password exists and is active
   - Try generating a new App Password
4. **Test with a different email** - Try sending to a different Gmail account
5. **Check internet connection** on the server

## Need Help?

Share these details:
1. Error message from backend console
2. Output of `node check-email-config.js`
3. Your `.env` file structure (without actual passwords)
4. Whether you're on localhost or production

