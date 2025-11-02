// Email Configuration Diagnostic Script
// Run this with: node check-email-config.js

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('\n🔍 EMAIL CONFIGURATION DIAGNOSTIC\n');
console.log('═══════════════════════════════════════════════════════════\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ MISSING'}`);
if (process.env.EMAIL_USER) {
  console.log(`   Value: ${process.env.EMAIL_USER}`);
}

console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ MISSING'}`);
if (process.env.EMAIL_PASSWORD) {
  const passLength = process.env.EMAIL_PASSWORD.length;
  console.log(`   Length: ${passLength} characters`);
  if (passLength < 16) {
    console.log('   ⚠️  WARNING: App passwords are usually 16 characters. Make sure you removed spaces!');
  }
}

console.log(`   ADMIN_EMAIL: ${process.env.ADMIN_EMAIL ? '✅ Set' : '⚠️  Optional'}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL ? '✅ Set' : '⚠️  Optional'}`);
if (process.env.FRONTEND_URL) {
  console.log(`   Value: ${process.env.FRONTEND_URL}`);
}

console.log('\n═══════════════════════════════════════════════════════════\n');

// Test email transporter
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.log('❌ Cannot test email connection - Missing EMAIL_USER or EMAIL_PASSWORD\n');
  console.log('📝 SETUP INSTRUCTIONS:');
  console.log('   1. Create a .env file in the backend folder');
  console.log('   2. Add these variables:');
  console.log('      EMAIL_USER=your-email@gmail.com');
  console.log('      EMAIL_PASSWORD=your-16-char-app-password');
  console.log('   3. Get App Password from: https://myaccount.google.com/apppasswords');
  console.log('   4. Enable 2FA first if not already enabled\n');
  process.exit(1);
}

console.log('🔌 Testing Email Connection...\n');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ EMAIL CONNECTION FAILED\n');
    console.log('Error Details:');
    console.log(`   Code: ${error.code || 'N/A'}`);
    console.log(`   Command: ${error.command || 'N/A'}`);
    console.log(`   Message: ${error.message}\n`);
    
    console.log('🔧 TROUBLESHOOTING:');
    console.log('   1. Check if EMAIL_USER is your full Gmail address (e.g., user@gmail.com)');
    console.log('   2. Verify EMAIL_PASSWORD is a 16-character App Password (not your regular password)');
    console.log('   3. Ensure 2-Factor Authentication is enabled on your Google account');
    console.log('   4. Make sure you removed all spaces from the App Password');
    console.log('   5. Check if "Less secure app access" is enabled (if not using App Password)');
    console.log('   6. Try generating a new App Password\n');
    
    if (error.code === 'EAUTH') {
      console.log('   ⚠️  Authentication Error: Invalid credentials or App Password');
      console.log('   → Generate a new App Password: https://myaccount.google.com/apppasswords\n');
    }
    
    process.exit(1);
  } else {
    console.log('✅ EMAIL CONNECTION SUCCESSFUL!\n');
    console.log('📧 Test sending email...\n');
    
    // Send test email
    const testEmail = process.env.EMAIL_USER;
    const mailOptions = {
      from: `"Dfoods Test" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: '🧪 Dfoods Email Test',
      html: `
        <div style="font-family: Arial; max-width:600px; margin:auto; padding:20px;">
          <h2>✅ Email Test Successful!</h2>
          <p>If you received this email, your email configuration is working correctly.</p>
          <p>You can now receive OTP and other email notifications from Dfoods.</p>
          <hr>
          <p style="color:#666; font-size:12px;">
            Sent at: ${new Date().toLocaleString()}<br>
            From: ${process.env.EMAIL_USER}
          </p>
        </div>
      `,
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log('❌ FAILED TO SEND TEST EMAIL\n');
        console.log('Error:', err.message);
        console.log('\n🔧 Check:');
        console.log('   1. Internet connection');
        console.log('   2. Gmail account status');
        console.log('   3. App Password permissions\n');
        process.exit(1);
      } else {
        console.log('✅ TEST EMAIL SENT SUCCESSFULLY!\n');
        console.log(`   To: ${testEmail}`);
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Response: ${info.response}\n`);
        console.log('📬 Please check your inbox (and spam folder) for the test email.\n');
        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('✅ Email configuration is working correctly!');
        console.log('   You should now be able to receive OTP and other emails.\n');
        process.exit(0);
      }
    });
  }
});

