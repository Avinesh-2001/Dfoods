console.log('Starting test-email.js...');

try {
  const dotenv = require('dotenv');
  console.log('Loading dotenv...');
  dotenv.config();

  console.log('Environment variables:', {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '[REDACTED]' : 'undefined',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL
  });

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASSWORD in .env');
  }

  const nodemailer = require('nodemailer');
  console.log('Nodemailer loaded:', nodemailer !== undefined);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  console.log('Verifying transporter...');
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email configuration error:', error.message);
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });

  console.log('Sending test email...');
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'Test Email from Dfoods',
    html: '<h2>Test Email</h2><p>This is a test email to verify Nodemailer configuration.</p>'
  }, (error, info) => {
    if (error) {
      console.error('Error sending test email:', error.message);
    } else {
      console.log('Test email sent:', info.messageId);
    }
  });
} catch (error) {
  console.error('Script execution error:', error.message);
}