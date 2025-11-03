/**
 * Alternative: This script can be run on Render to get the refresh token
 * Deploy this as a temporary endpoint, authorize, get token, then remove
 */

import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI || 'https://dfoods.onrender.com/oauth2callback'
);

// Temporary endpoint to capture OAuth code and get refresh token
app.get('/oauth2callback', async (req, res) => {
  try {
    const code = req.query.code;
    
    if (!code) {
      return res.send(`
        <html>
          <body style="font-family: Arial; padding: 20px;">
            <h1>OAuth2 Callback</h1>
            <p>No authorization code received.</p>
          </body>
        </html>
      `);
    }

    const { tokens } = await oauth2Client.getToken(code);
    
    res.send(`
      <html>
        <head>
          <title>Gmail OAuth2 - Refresh Token</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .token { background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; word-break: break-all; margin: 10px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
            button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
          </style>
        </head>
        <body>
          <h1>✅ Gmail OAuth2 Refresh Token Generated!</h1>
          
          <div class="success">
            <h2>Your Refresh Token:</h2>
            <div class="token">${tokens.refresh_token || 'Not received - try again with prompt=consent'}</div>
          </div>

          <div class="warning">
            <h3>⚠️ Important Steps:</h3>
            <ol>
              <li>Copy the refresh token above</li>
              <li>Add it to Render environment variables as: <code>GMAIL_REFRESH_TOKEN</code></li>
              <li>Remove or secure this endpoint after use</li>
            </ol>
          </div>

          <h3>All Environment Variables for Render:</h3>
          <div class="token">
GMAIL_CLIENT_ID=${process.env.GMAIL_CLIENT_ID || 'NOT SET'}
GMAIL_CLIENT_SECRET=${process.env.GMAIL_CLIENT_SECRET ? '[SET]' : 'NOT SET'}
GMAIL_REFRESH_TOKEN=${tokens.refresh_token || 'NOT GENERATED'}
GMAIL_REDIRECT_URI=${process.env.GMAIL_REDIRECT_URI || 'https://dfoods.onrender.com'}
GMAIL_USER=${process.env.GMAIL_USER || 'NOT SET'}
          </div>

          <button onclick="navigator.clipboard.writeText('${tokens.refresh_token || ''}')">Copy Refresh Token</button>
        </body>
      </html>
    `);
  } catch (error) {
    res.send(`
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h1>Error</h1>
          <p>${error.message}</p>
          <pre>${error.stack}</pre>
        </body>
      </html>
    `);
  }
});

// Authorization URL generator
app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.send'],
    prompt: 'consent'
  });
  
  res.redirect(authUrl);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`OAuth2 helper running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}/auth to start authorization`);
});

