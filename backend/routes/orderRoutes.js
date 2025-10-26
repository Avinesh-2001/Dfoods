import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import userAuth from "../middlewares/userAuth.js";
import { authenticateAdmin } from "../middlewares/adminAuth.js";
import { body, validationResult } from "express-validator";
import { 
  sendOrderConfirmationEmail, 
  sendShippingConfirmationEmail, 
  sendDeliveryConfirmationEmail,
  sendOrderCancellationEmail 
} from "../config/emailConfig.js";

const router = express.Router();

// Create a new order from cart (user)
router.post(
  "/",
  userAuth,
  [
    body("shippingAddress.fullName").notEmpty().withMessage("Full name required"),
    body("shippingAddress.address").notEmpty().withMessage("Address required"),
    body("shippingAddress.city").notEmpty().withMessage("City required"),
    body("shippingAddress.state").notEmpty().withMessage("State required"),
    body("shippingAddress.country").notEmpty().withMessage("Country required"),
    body("shippingAddress.postalCode").notEmpty().withMessage("Postal code required"),
    body("shippingAddress.phone").notEmpty().withMessage("Phone required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { shippingAddress } = req.body;
    try {
      const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
      if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

      const items = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      const totalAmount = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

      const order = new Order({
        user: req.user._id,
        items,
        totalAmount,
        shippingAddress,
        paymentStatus: "pending",
        orderStatus: "processing"
      });

      await order.save();
      await Cart.findOneAndDelete({ user: req.user._id }); // Clear cart after order

      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get user's order history (user)
router.get("/", userAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get specific order (user)
router.get("/:id", userAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
      .populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Cancel order (user)
router.delete("/:id", userAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.orderStatus === "delivered") return res.status(400).json({ message: "Cannot cancel delivered order" });

    order.orderStatus = "cancelled";
    await order.save();
    res.json({ message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update order status (admin only)
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, paymentStatus },
      { new: true }
    ).populate("items.product user");
    
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Send appropriate emails based on status change
    try {
      if (orderStatus === 'shipped') {
        await sendShippingConfirmationEmail(order);
      } else if (orderStatus === 'delivered') {
        await sendDeliveryConfirmationEmail(order);
      } else if (orderStatus === 'cancelled') {
        await sendOrderCancellationEmail(order);
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the order update if email fails
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;