# 📧 Email Test Endpoint URLs

## ✅ Both Local and Production Work!

The test email endpoint is available in both environments. Here are the URLs:

### 🏠 Local Development

#### Option 1: Direct Backend (Recommended)
```bash
POST http://localhost:5000/api/test/test-email
Content-Type: application/json

{
  "to": "your-email@gmail.com"
}
```

#### Option 2: Via Next.js Proxy
```bash
POST http://localhost:3000/api/test/test-email
Content-Type: application/json

{
  "to": "your-email@gmail.com"
}
```

### 🌐 Production (Vercel)

```bash
POST https://dfood-project.vercel.app/api/test/test-email
Content-Type: application/json

{
  "to": "your-email@gmail.com"
}
```

## 📋 Test Config Status Endpoint

### Local
```bash
GET http://localhost:5000/api/test/email-config-status
# OR
GET http://localhost:3000/api/test/email-config-status
```

### Production
```bash
GET https://dfood-project.vercel.app/api/test/email-config-status
```

## 🧪 Using Postman

1. **Method:** POST
2. **URL:** Use one of the URLs above based on environment
3. **Headers:**
   ```
   Content-Type: application/json
   ```
4. **Body (raw JSON):**
   ```json
   {
     "to": "your-email@gmail.com"
   }
   ```
5. **Or test without body** (uses EMAIL_USER from .env):
   ```json
   {}
   ```

## 📝 Expected Response

### Success:
```json
{
  "success": true,
  "message": "Test email sent successfully to your-email@gmail.com",
  "messageId": "...",
  "response": "250 2.0.0 OK ...",
  "note": "Check your inbox and spam folder"
}
```

### Error:
```json
{
  "success": false,
  "error": "Error message here",
  "help": [
    "1. Check EMAIL_USER and EMAIL_PASSWORD in .env file",
    "2. Use Gmail App Password (not regular password)",
    "..."
  ]
}
```

## ⚠️ Important Notes

1. **Local Testing:**
   - Make sure backend server is running on port 5000
   - Make sure `.env` file exists in `backend/` folder
   - Restart backend after editing `.env` file

2. **Production Testing:**
   - Make sure environment variables are set in Vercel
   - Check Vercel dashboard > Settings > Environment Variables
   - Variables needed: `EMAIL_USER`, `EMAIL_PASSWORD`

3. **Both Environments:**
   - Uses same email configuration
   - Uses same Gmail App Password
   - Both should work identically

## 🔍 Troubleshooting

### Local not working?
- Check backend is running: `cd backend && npm start`
- Check `.env` file in `backend/` folder
- Check backend console for error messages

### Production not working?
- Check Vercel environment variables
- Check Vercel function logs
- Verify backend is deployed correctly

