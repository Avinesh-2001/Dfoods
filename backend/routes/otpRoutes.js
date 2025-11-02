import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendEmail } from '../utils/mailers.js'; // Ensure this path is correct
import { sendWelcomeEmail } from '../config/emailConfig.js';

const router = express.Router();
const otpStore = new Map();

// ---------------- SEND OTP ----------------
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User with this email already exists' });

    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0 });

    console.log(`✅ OTP generated for ${email}: ${otp}`); // Server log
    console.log(`🔐 OTP stored in memory. Expires in 5 minutes.`);

    const html = `
      <div style="font-family: Arial; max-width:600px; margin:auto;">
        <h2>Dfood Email Verification</h2>
        <p>Your OTP for verification is:</p>
        <h1 style="color:#f59e0b;">${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      </div>
    `;

    // Send response immediately, email will be sent in background
    // Always include OTP in response for now (can be removed later after email is confirmed working)
    res.json({ 
      message: 'OTP sent successfully', 
      expiresIn: 300,
      debugOtp: otp, // Temporary: Always include for debugging
      note: 'Check console for OTP. Email delivery may take time or fail.'
    });

    // Send email in background (non-blocking)
    console.log(`📧 Attempting to send OTP email to ${email}...`);
    console.log(`🔐 OTP to send: ${otp}`);
    
    sendEmail(email, 'Verify Your Email - Dfood', html)
      .then((result) => {
        if (result.success) {
          console.log(`✅ OTP email sent successfully to ${email}`);
          console.log(`📬 Message ID: ${result.info?.messageId || 'N/A'}`);
          if (result.info?.response) {
            console.log(`📬 Server response: ${result.info.response}`);
          }
        } else {
          console.error(`❌ FAILED to send OTP email to ${email}`);
          console.error(`❌ Error message: ${result.error}`);
          if (result.fullError) {
            console.error(`❌ Full error object:`, result.fullError);
          }
          console.error(`⚠️ USER CAN STILL USE OTP FROM CONSOLE: ${otp}`);
        }
      })
      .catch((error) => {
        console.error(`❌ EXCEPTION sending OTP email to ${email}:`, error.message);
        console.error(`❌ Full exception:`, error);
        console.error(`⚠️ USER CAN STILL USE OTP FROM CONSOLE: ${otp}`);
      });
  } catch (error) {
    console.error('❌ Error sending OTP:', error.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// ---------------- VERIFY OTP ----------------
router.post('/verify-otp', async (req, res) => {
  console.log(`[VERIFY-OTP] Attempt for email: ${req.body.email}`);
  try {
    const { email, otp, name, password } = req.body;

    if (!email || !otp || !name || !password) {
      console.log('❌ Validation failed: All fields are required');
      return res.status(400).json({ error: 'All fields are required' });
    }
    console.log('✅ Validation: All fields present.');

    const otpData = otpStore.get(email);
    if (!otpData) {
      console.log(`❌ Validation failed: No OTP data found for ${email}.`);
      return res.status(400).json({ error: 'OTP not found or expired' });
    }
    console.log('✅ Validation: OTP data found.');

    if (Date.now() > otpData.expiresAt) {
      console.log('❌ Validation failed: OTP has expired.');
      return res.status(400).json({ error: 'OTP has expired' });
    }
    console.log('✅ Validation: OTP not expired.');

    if (otpData.otp !== otp) {
      console.log(`❌ Validation failed: Invalid OTP. Expected ${otpData.otp}, but got ${otp}`);
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    console.log('✅ Validation: OTP code matches.');

    const user = await User.create({ name, email, password, isVerified: true });
    otpStore.delete(email);
    console.log(`✅ User created: ${email}`);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ _id: user._id, name: user.name, email: user.email })
      .catch(err => console.error('Welcome email error:', err));

    res.status(201).json({
      message: 'Account created and verified successfully',
      user: { id: user._id, name: user.name, email: user.email },
      token: token,
    });
  } catch (error) {
    console.error('❌ Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// ---------------- RESEND OTP ----------------
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User with this email already exists' });

    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0 });

    console.log(`✅ OTP (Resend) generated for ${email}: ${otp}`);
    console.log(`🔐 OTP stored in memory. Expires in 5 minutes.`);

    const html = `
      <div style="font-family: Arial; max-width:600px; margin:auto;">
        <h2>Dfood Email Verification (Resent)</h2>
        <h1 style="color:#f59e0b;">${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      </div>
    `;

    // Send response immediately, email will be sent in background
    res.json({ 
      message: 'OTP resent successfully', 
      expiresIn: 300,
      debugOtp: otp, // Temporary: Always include for debugging
      note: 'Check console for OTP. Email delivery may take time or fail.'
    });

    // Send email in background (non-blocking)
    console.log(`📧 Attempting to resend OTP email to ${email}...`);
    console.log(`🔐 OTP to resend: ${otp}`);
    
    sendEmail(email, 'Resend OTP - Dfood', html)
      .then((result) => {
        if (result.success) {
          console.log(`✅ Resend OTP email sent successfully to ${email}`);
          console.log(`📬 Message ID: ${result.info?.messageId || 'N/A'}`);
          if (result.info?.response) {
            console.log(`📬 Server response: ${result.info.response}`);
          }
        } else {
          console.error(`❌ FAILED to resend OTP email to ${email}`);
          console.error(`❌ Error message: ${result.error}`);
          if (result.fullError) {
            console.error(`❌ Full error object:`, result.fullError);
          }
          console.error(`⚠️ USER CAN STILL USE OTP FROM CONSOLE: ${otp}`);
        }
      })
      .catch((error) => {
        console.error(`❌ EXCEPTION resending OTP email to ${email}:`, error.message);
        console.error(`❌ Full exception:`, error);
        console.error(`⚠️ USER CAN STILL USE OTP FROM CONSOLE: ${otp}`);
      });
  } catch (error) {
    console.error('❌ Error resending OTP:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
});

export default router;
