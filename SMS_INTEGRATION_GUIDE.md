# SMS OTP Integration Guide

## Current Status
🔐 **OTP is generated and shown in backend console logs**  
📱 **SMS integration is pending** - Ready to integrate with any SMS provider

## How to Get OTP (Development)
1. User clicks "Verify number" in profile
2. Check **backend console** logs
3. Look for: `✅ Phone OTP generated for +91XXXXXXXXXX: 123456`
4. Use this OTP to verify

## Production SMS Integration Options

### Option 1: Twilio (Recommended)
**Setup:**
1. Create account at https://www.twilio.com
2. Get Account SID, Auth Token, and Phone Number
3. Add to `.env`:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

**Code Update in `backend/routes/phoneOtpRoutes.js`:**
```javascript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// In send-phone-otp route, replace the TODO section:
await client.messages.create({
  body: `Your Dfoods verification code is: ${otp}`,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: phone
});
```

**Install package:**
```bash
cd backend
npm install twilio
```

---

### Option 2: AWS SNS
**Setup:**
1. Configure AWS account
2. Enable SNS service
3. Add credentials to `.env`:
```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
```

**Code:**
```javascript
import AWS from 'aws-sdk';

const sns = new AWS.SNS({
  apiVersion: '2010-03-31',
  region: process.env.AWS_REGION
});

await sns.publish({
  Message: `Your Dfoods verification code is: ${otp}`,
  PhoneNumber: phone
}).promise();
```

---

### Option 3: MSG91 (India-specific)
**Setup:**
1. Sign up at https://msg91.com
2. Get Auth Key and Template ID
3. Add to `.env`:
```env
MSG91_AUTH_KEY=your_auth_key
MSG91_TEMPLATE_ID=your_template_id
```

**Code:**
```javascript
import axios from 'axios';

await axios.get(`https://api.msg91.com/api/v5/otp`, {
  params: {
    authkey: process.env.MSG91_AUTH_KEY,
    mobile: phone,
    otp: otp
  }
});
```

---

## Current Implementation Location
**File:** `backend/routes/phoneOtpRoutes.js`  
**Line:** ~28 (Look for the TODO comment)

```javascript
// TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
// For now, return OTP in response for development
```

Replace this section with your chosen SMS provider code.

---

## Testing in Development
- OTP is logged to console: `console.log('OTP:', otp)`
- OTP also shown in API response: `debugOtp` field
- OTP displayed in browser toast for 5 seconds
- Valid for 10 minutes

## Production Checklist
- [ ] Choose SMS provider
- [ ] Add credentials to environment variables
- [ ] Install required npm package
- [ ] Update phoneOtpRoutes.js
- [ ] Remove debugOtp from response
- [ ] Test with real phone number
- [ ] Deploy to production

---

**Note:** Current OTP system is fully functional and ready for SMS integration. Just add your preferred SMS service!

