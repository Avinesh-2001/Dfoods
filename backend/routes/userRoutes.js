import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import userAuth from "../middlewares/userAuth.js";
import { sendWelcomeEmail, sendPasswordChangedEmail } from "../config/emailConfig.js";

const router = express.Router();

// Register a new user
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      const user = new User({ name, email, password });
      await user.save();

      // Send welcome email
      try {
        await sendWelcomeEmail(user);
      } catch (emailError) {
        // Don't fail registration if email fails
      }

      const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: "1d" });
      res.status(201).json({ token, user: { id: user._id, name, email } });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Login user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: "1d" });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get user profile (protected)
router.get("/profile", userAuth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user profile (protected)
router.put(
  "/profile",
  userAuth,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try {
      const user = await User.findById(req.user._id);
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;

      await user.save();
      res.json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Forgot password
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Invalid email")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      
      // Send password reset email
      const { sendPasswordResetEmail } = await import('../config/emailConfig.js');
      try {
        await sendPasswordResetEmail(user, resetToken);
      } catch (emailError) {
        // Don't fail the request if email fails
      }
      
      res.json({ message: "Password reset link sent to email", resetToken });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Reset password
router.post(
  "/reset-password/:token",
  [body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { token } = req.params;
    const { password } = req.body;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.password = password;
      await user.save();
      
      // Send password changed confirmation email
      try {
        await sendPasswordChangedEmail(user);
      } catch (emailError) {
        // Don't fail if email fails
      }
      
      res.json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid or expired token", error: error.message });
    }
  }
);

export default router;