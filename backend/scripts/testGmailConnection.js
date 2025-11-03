/**
 * Test Gmail OAuth2 connection and refresh token
 */

import { google } from 'googleapis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const OAuth2 = google.auth.OAuth2;

async function testGmailConnection() {
  try {
    console.log('\n🔍 Testing Gmail OAuth2 Connection...\n');

    const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
    const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
    const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
    const USER_EMAIL = process.env.GMAIL_USER;

    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !USER_EMAIL) {
      console.error('❌ Missing required environment variables!');
      console.error(`CLIENT_ID: ${CLIENT_ID ? '✅' : '❌'}`);
      console.error(`CLIENT_SECRET: ${CLIENT_SECRET ? '✅' : '❌'}`);
      console.error(`REFRESH_TOKEN: ${REFRESH_TOKEN ? '✅' : '❌'}`);
      console.error(`USER_EMAIL: ${USER_EMAIL ? '✅' : '❌'}`);
      process.exit(1);
    }

    const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET);
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    console.log('🔄 Testing refresh token...');
    const { token } = await oauth2Client.getAccessToken();
    
    if (!token) {
      console.error('❌ Failed to get access token!');
      console.error('   Your refresh token may be invalid or expired.');
      process.exit(1);
    }

    console.log('✅ Access token obtained successfully!');
    console.log(`   Token length: ${token.length} characters`);
    console.log(`   Token preview: ${token.substring(0, 20)}...`);

    // Test Gmail API access
    console.log('\n🔄 Testing Gmail API access...');
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    
    const profile = await gmail.users.getProfile({ userId: 'me' });
    console.log('✅ Gmail API access successful!');
    console.log(`   Email: ${profile.data.emailAddress}`);
    console.log(`   Messages Total: ${profile.data.messagesTotal}`);

    console.log('\n✅ All tests passed! Gmail OAuth2 is working correctly.\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error(`Error: ${error.message}`);
    
    if (error.message.includes('invalid_grant')) {
      console.error('\n🔐 Invalid refresh token!');
      console.error('   Your refresh token may have been revoked or expired.');
      console.error('   You need to generate a new refresh token.');
      console.error('   Run: node scripts/generateGmailRefreshToken.js');
    } else if (error.message.includes('unauthorized')) {
      console.error('\n🔐 Unauthorized!');
      console.error('   Check that your OAuth2 client has the correct scopes.');
      console.error('   Required scope: https://www.googleapis.com/auth/gmail.send');
    } else {
      console.error('\nFull error:', error);
    }
    
    process.exit(1);
  }
}

testGmailConnection();

