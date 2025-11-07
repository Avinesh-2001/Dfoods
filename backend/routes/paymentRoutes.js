import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import userAuth from "../middlewares/userAuth.js";
import { authenticateAdmin } from "../middlewares/adminAuth.js";
import { sendOrderConfirmationEmail, sendPaymentSuccessEmail, sendPaymentErrorEmail, sendPaymentReminderEmail } from "../config/emailConfig.js";

import dotenv from "dotenv";
dotenv.config();

const stripeInstance = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const router = express.Router();

// Create payment intent (user, called during checkout)
router.post("/create", userAuth, async (req, res) => {
  try {
    const { orderId, paymentMethod = 'stripe' } = req.body;
    const order = await Order.findById(orderId).populate("items.product user");

    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Calculate total with tax and service charges
    const subtotal = order.totalAmount;
    const tax = subtotal * 0.18; // 18% GST
    const serviceCharge = subtotal * 0.02; // 2% service charge
    const totalAmount = subtotal + tax + serviceCharge;

    if (paymentMethod === 'stripe') {
      if (!stripeInstance) {
        return res.status(400).json({ message: "Stripe not configured" });
      }
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // amount in cents
        currency: "inr", // Changed to INR for Indian market
        metadata: { orderId: order._id.toString() },
        description: `Order #${order._id} - Dfoods Jaggery`,
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        totalAmount,
        subtotal,
        tax,
        serviceCharge
      });
    } else if (paymentMethod === 'razorpay') {
      // Razorpay integration
      const razorpayOrder = {
        amount: Math.round(totalAmount * 100), // amount in paise
        currency: "INR",
        receipt: `order_${order._id}`,
        notes: {
          orderId: order._id.toString(),
          userId: req.user._id.toString()
        }
      };

      res.json({
        razorpayOrder,
        totalAmount,
        subtotal,
        tax,
        serviceCharge,
        key: process.env.RAZORPAY_KEY_ID
      });
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Confirm payment
router.post("/confirm", userAuth, async (req, res) => {
  try {
    const { paymentIntentId, orderId, paymentMethod = 'stripe' } = req.body;
    const order = await Order.findById(orderId).populate("user");

    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (paymentMethod === 'stripe') {
      if (!stripeInstance) {
        return res.status(400).json({ message: "Stripe not configured" });
      }
      const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === "succeeded") {
        order.paymentStatus = "paid";
        await order.save();
        
        // Send confirmation emails
        await sendOrderConfirmationEmail(order);
        await sendPaymentSuccessEmail(order);
        
        res.json({ message: "Payment confirmed", order });
      } else {
        await sendPaymentErrorEmail(order, "Payment failed");
        res.status(400).json({ message: "Payment failed" });
      }
    } else if (paymentMethod === 'razorpay') {
      // Razorpay payment verification would go here
      // For now, we'll assume it's successful
      order.paymentStatus = "paid";
      await order.save();
      
      // Send confirmation emails
      await sendOrderConfirmationEmail(order);
      await sendPaymentSuccessEmail(order);
      
      res.json({ message: "Payment confirmed", order });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Stripe webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripeInstance.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed.", err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = "paid";
          await order.save();
        }
        break;
      default:
        break;
    }

    res.json({ received: true });
  }
);

// Get payment reminders (admin only)
router.get("/reminders", authenticateAdmin, async (req, res) => {
  try {
    const pendingOrders = await Order.find({ 
      paymentStatus: "pending",
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    }).populate("user");

    res.json({ pendingOrders, count: pendingOrders.length });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Send payment reminder (admin only)
router.post("/reminder/:orderId", authenticateAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("user");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus !== "pending") {
      return res.status(400).json({ message: "Order is not pending payment" });
    }

    // Send payment reminder email
    await sendPaymentReminderEmail(order);
    
    res.json({ message: "Payment reminder sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
