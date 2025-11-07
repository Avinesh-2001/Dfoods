import express from "express";
import Coupon from "../models/Coupon.js";
import userAuth from "../middlewares/userAuth.js";
import { authenticateAdmin } from "../middlewares/adminAuth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Validate and apply coupon (user)
router.post("/validate", userAuth, async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || !subtotal) {
      return res.status(400).json({ message: "Coupon code and subtotal are required" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({ message: "This coupon has expired or reached its usage limit" });
    }

    const discount = coupon.calculateDiscount(subtotal);

    if (discount === 0) {
      return res.status(400).json({ 
        message: `Minimum purchase amount of ₹${coupon.minPurchaseAmount} required` 
      });
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: discount,
        finalAmount: subtotal - discount
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Apply coupon to order (called during checkout)
router.post("/apply/:orderId", userAuth, async (req, res) => {
  try {
    const { code } = req.body;
    const { orderId } = req.params;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon || !coupon.isValid()) {
      return res.status(400).json({ message: "Invalid or expired coupon" });
    }

    // Mark coupon as used
    coupon.usedCount += 1;
    coupon.usedBy.push({ user: req.user._id });
    await coupon.save();

    res.json({
      message: "Coupon applied successfully",
      couponId: coupon._id
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all coupons (admin)
router.get("/admin/all", authenticateAdmin, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create coupon (admin)
router.post(
  "/admin",
  authenticateAdmin,
  [
    body("code").notEmpty().withMessage("Coupon code is required"),
    body("discountType").isIn(["percentage", "fixed"]).withMessage("Invalid discount type"),
    body("discountValue").isNumeric().withMessage("Discount value must be a number"),
    body("validUntil").isISO8601().withMessage("Valid until date is required")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const coupon = new Coupon(req.body);
      await coupon.save();
      res.status(201).json(coupon);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Coupon code already exists" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Update coupon (admin)
router.put("/admin/:id", authenticateAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete coupon (admin)
router.delete("/admin/:id", authenticateAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get active coupons (user - for display)
router.get("/active", async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ["$usedCount", "$usageLimit"] } }
      ]
    }).select("code discountType discountValue minPurchaseAmount validUntil");

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;

