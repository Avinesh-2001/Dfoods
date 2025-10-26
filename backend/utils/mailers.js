// utils/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log('Attempting to login with User:', process.env.EMAIL_USER);
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
    console.warn('⚠️ Email configuration warning:', error.message);
  } else {
    console.log('✅ Email transporter is ready to send emails');
  }
});

/**
 * Send email with detailed logs
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully → To: ${to} | Subject: ${subject}`);
    console.log('📬 Message ID:', info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

export default transporter;
 