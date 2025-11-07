import express from "express";
import Return from "../models/Return.js";
import Order from "../models/Order.js";
import userAuth from "../middlewares/userAuth.js";
import { authenticateAdmin } from "../middlewares/adminAuth.js";
import { body, validationResult } from "express-validator";
import {
  sendReturnCreatedEmail,
  sendReturnReceivedEmail,
  sendReturnApprovedEmail,
  sendReturnDeclinedEmail
} from "../config/emailConfig.js";

const router = express.Router();

// Create a return request (user)
router.post(
  "/",
  userAuth,
  [
    body("orderId").notEmpty().withMessage("Order ID required"),
    body("reason").notEmpty().withMessage("Reason required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { orderId, reason } = req.body;
    try {
      // Check if order exists and belongs to user
      const order = await Order.findOne({ _id: orderId, user: req.user._id });
      if (!order) return res.status(404).json({ message: "Order not found" });
      
      // Check if order is delivered
      if (order.orderStatus !== "delivered") {
        return res.status(400).json({ message: "Can only return delivered orders" });
      }

      // Check if return request already exists
      const existingReturn = await Return.findOne({ order: orderId });
      if (existingReturn) {
        return res.status(400).json({ message: "Return request already exists for this order" });
      }

      // Create return request
      const returnRequest = new Return({
        order: orderId,
        user: req.user._id,
        reason,
        status: "pending"
      });

      await returnRequest.save();

      // Populate data for email
      await returnRequest.populate('user order');
      
      // Send return created email (non-blocking)
      sendReturnCreatedEmail(returnRequest).catch(() => {
        // Email failure shouldn't block return creation
      });

      res.status(201).json(returnRequest);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get user's return requests (user)
router.get("/", userAuth, async (req, res) => {
  try {
    const returns = await Return.find({ user: req.user._id })
      .populate("order")
      .sort({ createdAt: -1 });
    res.json(returns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all return requests (admin)
router.get("/all", authenticateAdmin, async (req, res) => {
  try {
    const returns = await Return.find()
      .populate("order user")
      .sort({ createdAt: -1 });
    res.json(returns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update return status (admin)
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { status, adminNotes, refundAmount } = req.body;
    
    const returnRequest = await Return.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, refundAmount },
      { new: true }
    ).populate("order user");
    
    if (!returnRequest) {
      return res.status(404).json({ message: "Return request not found" });
    }

    // Send appropriate email based on status
    try {
      if (status === 'approved') {
        await sendReturnApprovedEmail(returnRequest);
      } else if (status === 'declined') {
        await sendReturnDeclinedEmail(returnRequest, adminNotes);
      } else if (status === 'received') {
        await sendReturnReceivedEmail(returnRequest);
      }
    } catch (emailError) {
      // Don't fail the status update if email fails
    }

    res.json(returnRequest);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete return request (admin)
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const returnRequest = await Return.findByIdAndDelete(req.params.id);
    if (!returnRequest) {
      return res.status(404).json({ message: "Return request not found" });
    }
    res.json({ message: "Return request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;

