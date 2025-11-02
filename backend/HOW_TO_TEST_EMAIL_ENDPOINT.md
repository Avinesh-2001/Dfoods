# 🧪 How to Test Email Endpoint on Production

## 📍 Your Production Endpoint
```
https://dfood-project.vercel.app/api/test/test-email
```

---

## Method 1: Using Postman (Easiest)

### Step 1: Open Postman
1. Create a new request
2. Set method to **POST**

### Step 2: Enter URL
```
https://dfood-project.vercel.app/api/test/test-email
```

### Step 3: Set Headers
1. Click on **Headers** tab
2. Add:
   - **Key:** `Content-Type`
   - **Value:** `application/json`

### Step 4: Set Body
1. Click on **Body** tab
2. Select **raw**
3. Select **JSON** from dropdown
4. Enter:
   ```json
   {
     "to": "your-email@gmail.com"
   }
   ```

### Step 5: Send Request
Click **Send** button

### Step 6: Check Response
- **Success:** You'll see `success: true` and email will be sent
- **Error:** You'll see error details and help messages

---

## Method 2: Using cURL (Command Line)

### Basic Request
```bash
curl -X POST https://dfood-project.vercel.app/api/test/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@gmail.com"}'
```

### Pretty Print (with jq)
```bash
curl -X POST https://dfood-project.vercel.app/api/test/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@gmail.com"}' | jq
```

---

## Method 3: Using JavaScript/Fetch

### In Browser Console
```javascript
fetch('https://dfood-project.vercel.app/api/test/test-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'your-email@gmail.com'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Response:', data);
  if (data.success) {
    console.log('✅ Email sent successfully!');
  } else {
    console.error('❌ Error:', data.error);
  }
})
.catch(error => console.error('Request failed:', error));
```

---

## Method 4: Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension in VS Code
2. Create new request
3. Set method: **POST**
4. URL: `https://dfood-project.vercel.app/api/test/test-email`
5. Headers:
   ```
   Content-Type: application/json
   ```
6. Body (JSON):
   ```json
   {
     "to": "your-email@gmail.com"
   }
   ```
7. Click Send

---

## Method 5: Check Email Config Status (GET Request)

### Using Browser
Simply open this URL in your browser:
```
https://dfood-project.vercel.app/api/test/email-config-status
```

### Using Postman
- Method: **GET**
- URL: `https://dfood-project.vercel.app/api/test/email-config-status`
- No headers or body needed
- Click Send

### Expected Response
```json
{
  "EMAIL_USER": "✅ Set",
  "EMAIL_PASSWORD": "✅ Set (16 chars)",
  "ADMIN_EMAIL": "admin@example.com",
  "NODE_ENV": "production",
  "note": "This endpoint shows config status without exposing sensitive data"
}
```

---

## 📋 Expected Responses

### ✅ Success Response
```json
{
  "success": true,
  "message": "Test email sent successfully to your-email@gmail.com",
  "messageId": "xxx@mail.gmail.com",
  "response": "250 2.0.0 OK xxx...",
  "note": "Check your inbox and spam folder"
}
```

### ❌ Error Response (Email not configured)
```json
{
  "success": false,
  "error": "EMAIL_USER or EMAIL_PASSWORD not configured in .env file",
  "fullError": { ... }
}
```

### ❌ Error Response (Authentication failed)
```json
{
  "success": false,
  "error": "Invalid login: 535-5.7.8 Username and Password not accepted",
  "help": [
    "1. Check EMAIL_USER and EMAIL_PASSWORD in .env file",
    "2. Use Gmail App Password (not regular password)",
    "3. Enable 2FA on Google account",
    "4. Remove spaces from App Password"
  ]
}
```

---

## 🔍 Troubleshooting

### Issue 1: "Connection refused" or "Network error"
**Solution:**
- Check if Vercel deployment is active
- Verify the URL is correct
- Check Vercel dashboard for deployment status

### Issue 2: "Email not configured"
**Solution:**
1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Add:
   - `EMAIL_USER` = your Gmail address
   - `EMAIL_PASSWORD` = your 16-char Gmail App Password
4. Redeploy the application

### Issue 3: "Authentication failed"
**Solution:**
- Use Gmail App Password (not regular password)
- Enable 2-Step Verification
- Remove spaces from App Password
- Regenerate App Password if needed

### Issue 4: Email sent but not received
**Solution:**
- Check spam/junk folder
- Wait a few minutes (can take up to 5 minutes)
- Check backend logs in Vercel dashboard
- Verify email address is correct

---

## 📸 Quick Postman Screenshot Guide

```
┌─────────────────────────────────────────┐
│ Method: POST ▼                         │
│ URL: https://dfood-project...          │
│ Send                                    │
├─────────────────────────────────────────┤
│ Params  Authorization  Headers  Body   │
│                                         │
│ Headers:                                │
│ Key: Content-Type                       │
│ Value: application/json                 │
│                                         │
│ Body:                                   │
│ ○ none  ○ form-data  ○ x-www-form-url   │
│ ● raw  ○ binary  ○ GraphQL             │
│ JSON ▼                                  │
│                                         │
│ {                                       │
│   "to": "your-email@gmail.com"         │
│ }                                       │
└─────────────────────────────────────────┘
```

---

## ✅ Quick Checklist

- [ ] Postman/Thunder Client installed
- [ ] Method set to **POST**
- [ ] URL is correct: `https://dfood-project.vercel.app/api/test/test-email`
- [ ] Header: `Content-Type: application/json`
- [ ] Body: `{"to": "your-email@gmail.com"}`
- [ ] Vercel environment variables are set
- [ ] Email inbox and spam folder checked

---

## 🎯 Test Scenarios

### Test 1: With Email Address
```json
{
  "to": "your-email@gmail.com"
}
```

### Test 2: Without Email (uses EMAIL_USER from env)
```json
{}
```

### Test 3: Check Config Only
```
GET https://dfood-project.vercel.app/api/test/email-config-status
```

---

## 📝 Notes

1. **Production vs Local:** Same endpoint, different URLs
2. **Email Config:** Must be set in Vercel Environment Variables
3. **Response Time:** Usually 1-3 seconds
4. **Email Delivery:** Can take 1-5 minutes to arrive
5. **Always Check Spam:** Emails might go to spam folder

