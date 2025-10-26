import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import userAuth from "../middlewares/userAuth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Get user's cart
router.get("/", userAuth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add item to cart
router.post(
  "/",
  userAuth,
  [
    body("product").isMongoId().withMessage("Invalid product ID"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { product, quantity } = req.body;
    try {
      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
      }

      const itemIndex = cart.items.findIndex(item => item.product.toString() === product);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product, quantity });
      }

      await cart.save();
      await cart.populate("items.product");
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Update cart item quantity
router.put(
  "/",
  userAuth,
  [
    body("product").isMongoId().withMessage("Invalid product ID"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { product, quantity } = req.body;
    try {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const itemIndex = cart.items.findIndex(item => item.product.toString() === product);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      await cart.save();
      await cart.populate("items.product");
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Remove item from cart
router.delete(
  "/:productId",
  userAuth,
  async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
      await cart.save();
      await cart.populate("items.product");
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Clear entire cart
router.delete("/", userAuth, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;