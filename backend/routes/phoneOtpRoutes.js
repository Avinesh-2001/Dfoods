import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import userAuth from '../middlewares/userAuth.js';

const router = express.Router();
const phoneOtpStore = new Map();

// Send OTP to phone number
router.post('/send-phone-otp', userAuth, async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    phoneOtpStore.set(phone, { 
      otp, 
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      userId: req.user._id 
    });

    console.log(`\n✅ Phone OTP generated for ${phone}: ${otp}`);
    console.log(`🔐 OTP stored in memory. Expires in 10 minutes.`);

    // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
    // For now, return OTP in response for development
    // In production, send via SMS and remove from response
    
    res.json({ 
      message: 'OTP sent to phone successfully', 
      expiresIn: 600,
      debugOtp: otp, // Remove this in production
      note: 'OTP available in console. SMS integration pending.'
    });

  } catch (error) {
    console.error('Error sending phone OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify phone OTP
router.post('/verify-phone-otp', userAuth, async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const otpData = phoneOtpStore.get(phone);
    if (!otpData) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (Date.now() > otpData.expiresAt) {
      phoneOtpStore.delete(phone);
      return res.status(400).json({ error: 'OTP has expired' });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP verified, update user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.phone = phone;
    user.phoneVerified = true;
    await user.save();

    // Clear OTP from store
    phoneOtpStore.delete(phone);

    console.log(`✅ Phone verified for user ${user.email}: ${phone}`);

    res.json({
      message: 'Phone number verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        phoneVerified: user.phoneVerified
      }
    });
  } catch (error) {
    console.error('Error verifying phone OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

export default router;

