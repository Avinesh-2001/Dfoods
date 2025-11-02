# 🔧 Fix Email Connection Timeout on Render

## Problem
Getting `ETIMEDOUT` (Connection timeout) when sending emails from Render deployment.

## Root Cause
Render's network configuration or Gmail SMTP blocking can cause connection timeouts. The free tier may have restrictions.

## Solutions

### Solution 1: Updated SMTP Configuration (Applied)
I've updated the email transporter with:
- Explicit port 587 (not using service: 'gmail')
- Timeout settings (10s connection, 5s greeting)
- Disabled pooling (can cause issues on Render)
- Retry mechanism

**Status:** ✅ Already applied in code

### Solution 2: Use Alternative Email Service (Recommended)

#### Option A: SendGrid (Free tier: 100 emails/day)
1. Sign up: https://sendgrid.com
2. Get API key
3. Update `backend/utils/mailers.js`:
   ```javascript
   transporter = nodemailer.createTransport({
     host: 'smtp.sendgrid.net',
     port: 587,
     auth: {
       user: 'apikey',
       pass: process.env.SENDGRID_API_KEY,
     },
   });
   ```
4. Add `SENDGRID_API_KEY` to Render environment variables

#### Option B: Mailgun (Free tier: 100 emails/day)
1. Sign up: https://mailgun.com
2. Get SMTP credentials
3. Update configuration:
   ```javascript
   transporter = nodemailer.createTransport({
     host: 'smtp.mailgun.org',
     port: 587,
     auth: {
       user: process.env.MAILGUN_SMTP_LOGIN,
       pass: process.env.MAILGUN_SMTP_PASSWORD,
     },
   });
   ```

#### Option C: AWS SES (Very cheap)
1. Setup AWS SES
2. Get SMTP credentials
3. Use AWS SES SMTP endpoint

### Solution 3: Check Render Network Settings

1. Go to Render Dashboard → Your Service
2. Check if there are network restrictions
3. Try upgrading to paid tier (if free tier blocks SMTP)

### Solution 4: Verify Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Verify App Password is active
3. Regenerate if needed
4. Make sure it's exactly 16 characters, no spaces

### Solution 5: Test with Different Configuration

Try using port 465 with SSL:
```javascript
transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## Current Status

✅ Backend deployed: `https://dfoods.onrender.com`
✅ Vercel configured: `NEXT_PUBLIC_API_URL` set
✅ Email config: Credentials set in Render
❌ Email sending: Connection timeout

## Immediate Action Items

1. **Try the updated code** (already deployed)
   - The new timeout settings might help
   - Test again: `POST https://dfoods.onrender.com/api/test/test-email`

2. **If still failing, switch to SendGrid/Mailgun**
   - More reliable for production
   - Better deliverability
   - Free tier available

3. **Check Render logs**
   - Look for any network errors
   - Check if ports are blocked

## Testing

After applying fixes, test:
```bash
POST https://dfoods.onrender.com/api/test/test-email
Content-Type: application/json

{
  "to": "abhishek020621@gmail.com"
}
```

Or via Vercel frontend:
```bash
POST https://dfood-project.vercel.app/api/test/test-email
```

## Recommendation

**Use SendGrid** - It's specifically designed for transactional emails and works better with cloud platforms like Render. Gmail SMTP is meant for personal use and often blocked by cloud providers.

