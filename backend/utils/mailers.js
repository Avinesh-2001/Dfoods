// utils/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Log email configuration status (without exposing password)
console.log('📧 Email Configuration Check:');
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set (' + process.env.EMAIL_USER + ')' : '❌ MISSING'}`);
console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✅ Set (' + process.env.EMAIL_PASSWORD.length + ' chars)' : '❌ MISSING'}`);
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.warn('⚠️ EMAIL NOT CONFIGURED - Emails will not be sent!');
  console.warn('   Add EMAIL_USER and EMAIL_PASSWORD to your .env file');
} else {
  console.log('✅ Email credentials found in environment');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter at startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration ERROR:', error.message);
    console.error('   Check:');
    console.error('   1. EMAIL_USER and EMAIL_PASSWORD in .env');
    console.error('   2. Use Gmail App Password (not regular password)');
    console.error('   3. Enable 2FA on Google account');
    console.error('   4. Remove spaces from App Password');
    if (error.code) {
      console.error(`   Error Code: ${error.code}`);
    }
  } else {
    console.log('✅ Email transporter is ready to send emails');
  }
});

/**
 * Send email with detailed logs
 */
export const sendEmail = async (to, subject, html) => {
  try {
    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      const error = 'EMAIL_USER or EMAIL_PASSWORD not configured';
      console.error(`❌ ${error}`);
      return { success: false, error };
    }

    const mailOptions = {
      from: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📧 From: ${mailOptions.from}`);
    console.log(`📧 Subject: ${subject}`);

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully → To: ${to} | Subject: ${subject}`);
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`📬 Response: ${info.response}`);
    return { success: true, info };
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error.message);
    console.error(`❌ Full error:`, error);
    if (error.code) console.error(`❌ Error code: ${error.code}`);
    if (error.command) console.error(`❌ Failed command: ${error.command}`);
    return { success: false, error: error.message, fullError: error };
  }
};

export default transporter;
 