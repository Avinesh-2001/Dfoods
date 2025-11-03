/**
 * Gmail OAuth2 Refresh Token Generator
 * 
 * This script generates a refresh token for Gmail API OAuth2 authentication.
 * Run this ONCE to get your refresh token, then add it to your .env file.
 * 
 * Usage:
 *   1. Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in .env
 *   2. Run: node scripts/generateGmailRefreshToken.js
 *   3. Follow the instructions to authorize the app
 *   4. Copy the refresh token to your .env file
 */

import { google } from 'googleapis';
import dotenv from 'dotenv';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const OAuth2 = google.auth.OAuth2;

// Create OAuth2 client
const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI || 'https://dfoods.onrender.com'
);

// Gmail API scopes
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

/**
 * Get and store new token after prompting for user authorization
 */
async function getNewToken() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent' // Force consent screen to get refresh token
  });

  console.log('\n🔐 Gmail OAuth2 Authorization\n');
  console.log('=====================================');
  console.log('Authorize this app by visiting this url:');
  console.log('\n' + authUrl + '\n');
  console.log('=====================================\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          console.error('❌ Error while trying to retrieve access token:', err);
          return reject(err);
        }
        resolve(token);
      });
    });
  });
}

/**
 * Main function to generate refresh token
 */
async function main() {
  try {
    console.log('\n🚀 Gmail OAuth2 Refresh Token Generator\n');
    console.log('=====================================\n');

    // Check if credentials are set
    const clientId = process.env.GMAIL_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('❌ Error: Missing OAuth2 credentials!\n');
      console.error('Please set the following in your .env file:');
      console.error('  GMAIL_CLIENT_ID=your_client_id');
      console.error('  GMAIL_CLIENT_SECRET=your_client_secret');
      console.error('  GMAIL_REDIRECT_URI=https://dfoods.onrender.com (optional)\n');
      process.exit(1);
    }

    console.log('✅ OAuth2 credentials found\n');

    // Get new token
    const token = await getNewToken();

    console.log('\n✅ Successfully retrieved tokens!\n');
    console.log('=====================================');
    console.log('📋 Add these to your .env file:\n');
    console.log(`GMAIL_CLIENT_ID=${clientId}`);
    console.log(`GMAIL_CLIENT_SECRET=${clientSecret}`);
    console.log(`GMAIL_REFRESH_TOKEN=${token.refresh_token}`);
    console.log(`GMAIL_REDIRECT_URI=${process.env.GMAIL_REDIRECT_URI || 'https://dfoods.onrender.com'}`);
    console.log(`GMAIL_USER=${process.env.GMAIL_USER || 'your-email@gmail.com'}`);
    console.log('\n=====================================\n');

    if (token.refresh_token) {
      console.log('✅ Refresh token generated successfully!');
      console.log('✅ Copy the GMAIL_REFRESH_TOKEN above to your .env file\n');
    } else {
      console.log('⚠️  Warning: No refresh token received!');
      console.log('   Make sure you use prompt: "consent" in the auth URL\n');
    }

    if (token.access_token) {
      console.log('✅ Access token received (valid for 1 hour)');
      console.log('✅ Refresh token will be used for long-term access\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error generating refresh token:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET are correct');
    console.error('2. Verify the redirect URI matches your Google Cloud Console settings');
    console.error('3. Ensure you clicked "Allow" on the consent screen');
    console.error('4. Check that the authorization code was copied correctly\n');
    process.exit(1);
  }
}

// Run the script
main();

