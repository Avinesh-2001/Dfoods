/**
 * Automated Gmail OAuth2 Refresh Token Generator
 * This script opens a browser and handles the OAuth flow automatically
 */

import { google } from 'googleapis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import http from 'http';
import open from 'open';
import { spawn } from 'child_process';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const OAuth2 = google.auth.OAuth2;

// Create OAuth2 client
const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/oauth2callback'
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// Create a simple HTTP server to handle the callback
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    if (url.pathname === '/oauth2callback') {
      const code = url.searchParams.get('code');
      
      if (code) {
        try {
          const { tokens } = await oauth2Client.getToken(code);
          
          // Save tokens to .env file
          const envPath = join(__dirname, '../.env');
          let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
          
          // Update or add GMAIL_REFRESH_TOKEN
          if (envContent.includes('GMAIL_REFRESH_TOKEN=')) {
            envContent = envContent.replace(
              /GMAIL_REFRESH_TOKEN=.*/,
              `GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`
            );
          } else {
            envContent += `\nGMAIL_REFRESH_TOKEN=${tokens.refresh_token}\n`;
          }
          
          fs.writeFileSync(envPath, envContent, 'utf8');
          
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: Arial; text-align: center; padding: 50px;">
                <h1 style="color: green;">✅ Success!</h1>
                <p>Refresh token has been saved to your .env file.</p>
                <p>You can close this window now.</p>
                <script>setTimeout(() => window.close(), 2000);</script>
              </body>
            </html>
          `);
          
          console.log('\n✅ ============================================');
          console.log('✅ Refresh token generated and saved!');
          console.log('✅ ============================================\n');
          console.log('📋 Your Gmail OAuth2 credentials are now configured:');
          console.log(`   GMAIL_CLIENT_ID: ${process.env.GMAIL_CLIENT_ID}`);
          console.log(`   GMAIL_CLIENT_SECRET: [configured]`);
          console.log(`   GMAIL_REFRESH_TOKEN: [saved to .env]`);
          console.log(`   GMAIL_USER: ${process.env.GMAIL_USER}`);
          console.log(`   GMAIL_REDIRECT_URI: http://localhost:3000/oauth2callback`);
          console.log('\n📝 Next: Add these to Render environment variables:');
          console.log('   GMAIL_CLIENT_ID');
          console.log('   GMAIL_CLIENT_SECRET');
          console.log('   GMAIL_REFRESH_TOKEN (from .env file)');
          console.log('   GMAIL_REDIRECT_URI=https://dfoods.onrender.com');
          console.log('   GMAIL_USER');
          console.log('\n');
          
          server.close();
          process.exit(0);
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end(`<html><body><h1>Error</h1><p>${error.message}</p></body></html>`);
          console.error('❌ Error:', error.message);
          server.close();
          process.exit(1);
        }
      } else {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>Error</h1><p>No authorization code received</p></body></html>');
        server.close();
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
  }
});

async function main() {
  try {
    console.log('\n🚀 Automated Gmail OAuth2 Refresh Token Generator\n');
    console.log('=====================================\n');

    const clientId = process.env.GMAIL_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('❌ Error: Missing OAuth2 credentials!\n');
      process.exit(1);
    }

    // Update Google Cloud Console redirect URI to include localhost
    // For now, we'll use localhost:3000 which should work if the user updates their OAuth client
    const redirectUri = 'http://localhost:3000/oauth2callback';
    
    // Generate auth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      redirect_uri: redirectUri
    });

    // Start server
    server.listen(3000, () => {
      console.log('✅ Local server started on http://localhost:3000');
      console.log('\n📖 Opening browser for authorization...\n');
      
      // Try to open browser
      setTimeout(async () => {
        try {
          await import('open').then(module => module.default(authUrl));
        } catch (error) {
          console.log('⚠️  Could not open browser automatically.');
          console.log('\n📋 Please open this URL in your browser:\n');
          console.log(authUrl);
          console.log('\n');
        }
      }, 1000);
    });

    console.log('⏳ Waiting for authorization...');
    console.log('   (A browser window should open automatically)');
    console.log('   (If not, copy the URL above and open it manually)\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

