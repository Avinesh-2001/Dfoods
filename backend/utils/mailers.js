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

// Create transporter with better error handling
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Add additional options for better reliability
    pool: true,
    maxConnections: 1,
    rateDelta: 200,
    rateLimit: 5,
  });
} catch (error) {
  console.error('❌ Failed to create email transporter:', error.message);
  transporter = null;
}

// Verify transporter at startup (only if transporter was created)
if (transporter) {
  transporter.verify((error, success) => {
    if (error) {
      console.error('\n❌ ============================================');
      console.error('❌ EMAIL CONFIGURATION ERROR');
      console.error('❌ ============================================');
      console.error(`❌ Error: ${error.message}`);
      console.error('\n📋 TROUBLESHOOTING STEPS:');
      console.error('   1. Check .env file exists in backend/ folder');
      console.error('   2. EMAIL_USER should be your full Gmail address');
      console.error('   3. EMAIL_PASSWORD should be a Gmail App Password (16 characters, no spaces)');
      console.error('   4. To create App Password:');
      console.error('      - Go to Google Account > Security');
      console.error('      - Enable 2-Step Verification');
      console.error('      - Go to App Passwords');
      console.error('      - Generate password for "Mail"');
      console.error('      - Copy the 16-character password (no spaces)');
      console.error('   5. Make sure .env file has NO quotes around values');
      console.error('      Correct: EMAIL_USER=yourname@gmail.com');
      console.error('      Wrong:   EMAIL_USER="yourname@gmail.com"');
      if (error.code) {
        console.error(`\n   Error Code: ${error.code}`);
      }
      if (error.command) {
        console.error(`   Failed Command: ${error.command}`);
      }
      console.error('❌ ============================================\n');
    } else {
      console.log('\n✅ ============================================');
      console.log('✅ Email transporter verified and ready!');
      console.log('✅ ============================================\n');
    }
  });
} else {
  console.error('\n❌ Email transporter not created - check .env file\n');
}

/**
 * Send email with detailed logs
 */
export const sendEmail = async (to, subject, html) => {
  try {
    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      const error = 'EMAIL_USER or EMAIL_PASSWORD not configured in .env file';
      console.error(`\n❌ ${error}`);
      console.error(`   Current EMAIL_USER: ${process.env.EMAIL_USER || 'NOT SET'}`);
      console.error(`   Current EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? 'SET (' + process.env.EMAIL_PASSWORD.length + ' chars)' : 'NOT SET'}`);
      console.error(`   Check: backend/.env file exists and has these variables\n`);
      return { success: false, error };
    }

    // Check if transporter exists
    if (!transporter) {
      const error = 'Email transporter not initialized. Check email configuration.';
      console.error(`❌ ${error}`);
      return { success: false, error };
    }

    const mailOptions = {
      from: `"Dfoods" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      // Add text version for better compatibility
      text: html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    };

    console.log(`\n📧 Attempting to send email:`);
    console.log(`   To: ${to}`);
    console.log(`   From: ${mailOptions.from}`);
    console.log(`   Subject: ${subject}`);

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully!`);
    console.log(`   Message ID: ${info.messageId || 'N/A'}`);
    console.log(`   Response: ${info.response || 'N/A'}`);
    console.log(`   To: ${to}\n`);
    
    return { success: true, info };
  } catch (error) {
    console.error(`\n❌ Error sending email to ${to}:`);
    console.error(`   Error Message: ${error.message}`);
    if (error.code) {
      console.error(`   Error Code: ${error.code}`);
    }
    if (error.command) {
      console.error(`   Failed Command: ${error.command}`);
    }
    if (error.responseCode) {
      console.error(`   Response Code: ${error.responseCode}`);
    }
    if (error.response) {
      console.error(`   Response: ${error.response}`);
    }
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      console.error(`\n   🔐 AUTHENTICATION ERROR:`);
      console.error(`   - Check EMAIL_USER and EMAIL_PASSWORD in .env`);
      console.error(`   - Use Gmail App Password (16 chars, no spaces)`);
      console.error(`   - Enable 2-Step Verification on Google Account\n`);
    } else if (error.code === 'ECONNECTION') {
      console.error(`\n   🌐 CONNECTION ERROR:`);
      console.error(`   - Check your internet connection`);
      console.error(`   - Gmail SMTP servers may be blocked\n`);
    } else if (error.code === 'ETIMEDOUT') {
      console.error(`\n   ⏱️ TIMEOUT ERROR:`);
      console.error(`   - Gmail servers may be slow`);
      console.error(`   - Try again in a few minutes\n`);
    }
    
    console.error(`❌ Full error object:`, error);
    console.error('');
    
    return { success: false, error: error.message, fullError: error };
  }
};

export default transporter;
 