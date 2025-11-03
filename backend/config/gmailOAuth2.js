/**
 * Gmail OAuth2 Configuration for Nodemailer
 * 
 * This module creates and configures a Nodemailer transporter
 * using Gmail API OAuth2 authentication.
 */

import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const OAuth2 = google.auth.OAuth2;

// Get OAuth2 credentials from environment variables
const CLIENT_ID = process.env.GMAIL_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI || 'https://dfoods.onrender.com';
const USER_EMAIL = process.env.GMAIL_USER || process.env.EMAIL_USER || process.env.FROM_EMAIL;

/**
 * Create OAuth2 client
 */
function createOAuth2Client() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Gmail OAuth2 credentials not configured. Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in .env');
  }

  return new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
}

/**
 * Get access token using refresh token
 */
async function getAccessToken() {
  try {
    const oauth2Client = createOAuth2Client();

    if (!REFRESH_TOKEN) {
      throw new Error('Gmail refresh token not configured. Set GMAIL_REFRESH_TOKEN in .env. Run scripts/generateGmailRefreshToken.js to generate one.');
    }

    oauth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN
    });

    // Add timeout to prevent hanging
    const tokenPromise = oauth2Client.getAccessToken();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Access token request timeout after 10 seconds')), 10000)
    );

    const { token } = await Promise.race([tokenPromise, timeoutPromise]);
    return token;
  } catch (error) {
    console.error('❌ Error getting Gmail access token:', error.message);
    if (error.message.includes('invalid_grant')) {
      console.error('   🔐 Invalid refresh token. You may need to regenerate it.');
      console.error('   🔐 The refresh token may have been revoked or expired.');
    } else if (error.message.includes('timeout')) {
      console.error('   ⏱️  Request timed out. Check network connectivity.');
    }
    throw error;
  }
}

/**
 * Create Nodemailer transporter with Gmail OAuth2
 */
let transporter = null;

async function createTransporter() {
  try {
    // Check if credentials are configured
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.warn('⚠️ Gmail OAuth2 credentials not configured');
      return null;
    }

    if (!REFRESH_TOKEN) {
      console.warn('⚠️ Gmail refresh token not configured. Run scripts/generateGmailRefreshToken.js to generate one.');
      return null;
    }

    if (!USER_EMAIL) {
      console.warn('⚠️ Gmail user email not configured. Set GMAIL_USER in .env');
      return null;
    }

    console.log('🔄 Getting Gmail access token...');
    
    // Get access token with timeout
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      throw new Error('Failed to get access token');
    }

    console.log('✅ Access token obtained');

    // Create transporter
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: USER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    // Verify transporter configuration with timeout
    console.log('🔄 Verifying Gmail OAuth2 transporter...');
    const verifyPromise = transporter.verify();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Transporter verification timeout after 10 seconds')), 10000)
    );
    
    await Promise.race([verifyPromise, timeoutPromise]);
    console.log('✅ Gmail OAuth2 transporter configured and verified');
    
    return transporter;
  } catch (error) {
    console.error('❌ Error creating Gmail OAuth2 transporter:', error.message);
    if (error.message.includes('timeout')) {
      console.error('   ⏱️  Connection timeout. This might be a network issue or Gmail API rate limiting.');
      console.error('   💡 Try again in a few moments. If it persists, check:');
      console.error('      1. Network connectivity on Render');
      console.error('      2. Gmail API is accessible');
      console.error('      3. Refresh token is still valid');
    } else if (error.message.includes('invalid_grant')) {
      console.error('   🔐 Invalid refresh token. You need to regenerate it.');
    }
    return null;
  }
}

/**
 * Get or create transporter (with token refresh if needed)
 */
export async function getTransporter() {
  try {
    if (transporter) {
      // Try to verify existing transporter
      try {
        await transporter.verify();
        return transporter;
      } catch (error) {
        // Token expired, refresh it
        console.log('🔄 Refreshing Gmail access token...');
        transporter = null;
      }
    }

    // Create new transporter with fresh token
    return await createTransporter();
  } catch (error) {
    console.error('❌ Error getting transporter:', error.message);
    return null;
  }
}

/**
 * Send email using Gmail OAuth2
 */
export async function sendEmailViaGmail(mailOptions) {
  try {
    console.log('🔄 Getting Gmail OAuth2 transporter...');
    const transporter = await getTransporter();
    
    if (!transporter) {
      throw new Error('Gmail OAuth2 transporter not available. Check your configuration.');
    }

    console.log('✅ Transporter ready, sending email...');
    
    // Send email with timeout
    const sendPromise = transporter.sendMail({
      from: `"${mailOptions.from?.split('<')[0]?.trim() || 'Dfoods'}" <${USER_EMAIL}>`,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.html?.replace(/<[^>]*>/g, '') || ''
    });
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000)
    );
    
    const info = await Promise.race([sendPromise, timeoutPromise]);

    console.log('✅ Email sent via Gmail OAuth2:', info.messageId);
    return { success: true, messageId: info.messageId, info };
  } catch (error) {
    console.error('❌ Error sending email via Gmail OAuth2:', error.message);
    if (error.message.includes('timeout')) {
      console.error('   ⏱️  Email sending timed out. This might indicate:');
      console.error('      1. Network connectivity issues from Render to Gmail');
      console.error('      2. Gmail API rate limiting');
      console.error('      3. Invalid refresh token causing authentication delays');
    }
    throw error;
  }
}

/**
 * Check if Gmail OAuth2 is configured
 */
export function isGmailConfigured() {
  return !!(CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN && USER_EMAIL);
}

// Initialize transporter on module load
if (isGmailConfigured()) {
  createTransporter().catch((error) => {
    console.warn('⚠️ Failed to initialize Gmail OAuth2 transporter:', error.message);
  });
}

export default {
  getTransporter,
  sendEmailViaGmail,
  isGmailConfigured,
  createOAuth2Client
};

