import express from 'express';
import { sendEmail } from '../utils/mailers.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    const { to } = req.body;
    const testEmail = to || process.env.EMAIL_USER;

    if (!testEmail) {
      return res.status(400).json({ 
        error: 'No email provided. Send { "to": "your-email@example.com" } or set EMAIL_USER in .env' 
      });
    }

    console.log('\n🔍 === EMAIL DIAGNOSTIC TEST ===');
    console.log(`📧 Testing email to: ${testEmail}`);
    console.log(`📧 From: ${process.env.EMAIL_USER}`);
    console.log(`📧 EMAIL_USER set: ${process.env.EMAIL_USER ? '✅ YES' : '❌ NO'}`);
    console.log(`📧 EMAIL_PASSWORD set: ${process.env.EMAIL_PASSWORD ? '✅ YES (' + process.env.EMAIL_PASSWORD.length + ' chars)' : '❌ NO'}`);

    const html = `
      <div style="font-family: Arial; max-width:600px; margin:auto; padding:20px;">
        <h2 style="color:#f59e0b;">Dfoods Email Test</h2>
        <p>If you receive this email, your email configuration is working correctly!</p>
        <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
        <hr style="border:1px solid #ddd; margin:20px 0;">
        <p style="color:#666; font-size:12px;">This is a test email from your Dfoods backend server.</p>
      </div>
    `;

    const result = await sendEmail(testEmail, 'Dfoods Email Test - ' + new Date().toLocaleString(), html);

    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log(`📬 Message ID: ${result.info?.messageId || 'N/A'}`);
      res.json({ 
        success: true, 
        message: `Test email sent successfully to ${testEmail}`,
        messageId: result.info?.messageId,
        response: result.info?.response,
        note: 'Check your inbox and spam folder'
      });
    } else {
      console.log('❌ Email failed to send!');
      console.log(`❌ Error: ${result.error}`);
      res.status(500).json({ 
        success: false, 
        error: result.error,
        fullError: process.env.NODE_ENV === 'development' ? result.fullError : undefined,
        help: [
          '1. Check EMAIL_USER and EMAIL_PASSWORD in .env file',
          '2. Use Gmail App Password (not regular password)',
          '3. Enable 2FA on Google account',
          '4. Remove spaces from App Password',
          '5. Check if Less Secure Apps is enabled (deprecated, use App Password instead)'
        ]
      });
    }
  } catch (error) {
    console.error('❌ Exception in test email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      fullError: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Get email config status (without exposing password)
router.get('/email-config-status', (req, res) => {
  res.json({
    EMAIL_USER: process.env.EMAIL_USER ? '✅ Set' : '❌ Missing',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? `✅ Set (${process.env.EMAIL_PASSWORD.length} chars)` : '❌ Missing',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'development',
    note: 'This endpoint shows config status without exposing sensitive data'
  });
});

export default router;

