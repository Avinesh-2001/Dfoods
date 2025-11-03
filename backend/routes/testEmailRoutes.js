import express from 'express';
import { sendEmail } from '../utils/mailers.js';
import { isGmailConfigured } from '../config/gmailOAuth2.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    const { to } = req.body;
    const testEmail = to || process.env.GMAIL_USER || process.env.EMAIL_USER || process.env.ADMIN_EMAIL;

    if (!testEmail) {
      return res.status(400).json({ 
        error: 'No email provided. Send { "to": "your-email@example.com" } in request body' 
      });
    }

    console.log('\n🔍 === EMAIL DIAGNOSTIC TEST ===');
    console.log(`📧 Testing email to: ${testEmail}`);
    
    // Check Gmail OAuth2 configuration
    const gmailConfigured = isGmailConfigured();
    const sendGridConfigured = !!(process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL);
    const oldEmailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
    
    console.log(`📧 Gmail OAuth2: ${gmailConfigured ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`📧 SendGrid: ${sendGridConfigured ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`📧 Old SMTP: ${oldEmailConfigured ? '✅ Configured' : '❌ Not configured'}`);
    
    if (gmailConfigured) {
      console.log(`📧 From: ${process.env.GMAIL_USER}`);
      console.log(`📧 GMAIL_CLIENT_ID: ${process.env.GMAIL_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
      console.log(`📧 GMAIL_CLIENT_SECRET: ${process.env.GMAIL_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
      console.log(`📧 GMAIL_REFRESH_TOKEN: ${process.env.GMAIL_REFRESH_TOKEN ? '✅ Set' : '❌ Missing'}`);
      console.log(`📧 GMAIL_USER: ${process.env.GMAIL_USER ? '✅ Set' : '❌ Missing'}`);
    }

    const html = `
      <div style="font-family: Arial; max-width:600px; margin:auto; padding:20px;">
        <h2 style="color:#f59e0b;">✅ Dfoods Email Test</h2>
        <p>If you receive this email, your email configuration is working correctly!</p>
        <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Email Service:</strong> ${gmailConfigured ? 'Gmail OAuth2' : sendGridConfigured ? 'SendGrid' : 'SMTP'}</p>
        <hr style="border:1px solid #ddd; margin:20px 0;">
        <p style="color:#666; font-size:12px;">This is a test email from your Dfoods backend server.</p>
      </div>
    `;

    const result = await sendEmail(testEmail, '✅ Dfoods Email Test - ' + new Date().toLocaleString(), html);

    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log(`📬 Message ID: ${result.info?.messageId || 'N/A'}`);
      res.json({ 
        success: true, 
        message: `Test email sent successfully to ${testEmail}`,
        messageId: result.info?.messageId,
        service: gmailConfigured ? 'Gmail OAuth2' : sendGridConfigured ? 'SendGrid' : 'SMTP',
        note: 'Check your inbox and spam folder'
      });
    } else {
      console.log('❌ Email failed to send!');
      console.log(`❌ Error: ${result.error}`);
      res.status(500).json({ 
        success: false, 
        error: result.error,
        service: gmailConfigured ? 'Gmail OAuth2' : sendGridConfigured ? 'SendGrid' : 'SMTP',
        configuration: {
          gmailOAuth2: gmailConfigured,
          sendGrid: sendGridConfigured,
          smtp: oldEmailConfigured
        },
        help: gmailConfigured ? [
          '1. Check GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER in Render environment variables',
          '2. Verify refresh token is valid and not expired',
          '3. Check Render logs for detailed error messages',
          '4. Ensure Gmail API is accessible from Render'
        ] : [
          '1. Configure Gmail OAuth2 or SendGrid in Render environment variables',
          '2. Check environment variables are set correctly',
          '3. Verify credentials are valid'
        ]
      });
    }
  } catch (error) {
    console.error('❌ Exception in test email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      fullError: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get email config status (without exposing secrets)
router.get('/email-config-status', (req, res) => {
  const gmailConfigured = isGmailConfigured();
  const sendGridConfigured = !!(process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL);
  const oldEmailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
  
  res.json({
    configured: gmailConfigured || sendGridConfigured || oldEmailConfigured,
    gmailOAuth2: {
      configured: gmailConfigured,
      GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID ? '✅ Set' : '❌ Missing',
      GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
      GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN ? '✅ Set' : '❌ Missing',
      GMAIL_USER: process.env.GMAIL_USER || '❌ Missing',
      GMAIL_REDIRECT_URI: process.env.GMAIL_REDIRECT_URI || '❌ Missing'
    },
    sendGrid: {
      configured: sendGridConfigured,
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing',
      FROM_EMAIL: process.env.FROM_EMAIL || '❌ Missing'
    },
    smtp: {
      configured: oldEmailConfigured,
      EMAIL_USER: process.env.EMAIL_USER ? '✅ Set' : '❌ Missing',
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? `✅ Set (${process.env.EMAIL_PASSWORD.length} chars)` : '❌ Missing'
    },
    activeService: gmailConfigured ? 'Gmail OAuth2' : sendGridConfigured ? 'SendGrid' : oldEmailConfigured ? 'SMTP' : 'None',
    note: 'This endpoint shows config status without exposing sensitive data'
  });
});

export default router;

