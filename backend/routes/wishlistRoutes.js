import express from "express";
import Wishlist from "../models/Wishlist.js";
import userAuth from "../middlewares/userAuth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Get user's wishlist (protected)
router.get("/", userAuth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate("products");
    if (!wishlist) {
      wishlist = { userId: req.user._id, products: [] };
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add product to wishlist
router.post(
  "/add",
  userAuth,
  [body("productId").isMongoId().withMessage("Invalid product ID")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { productId } = req.body;
    try {
      let wishlist = await Wishlist.findOne({ userId: req.user._id });
      if (!wishlist) wishlist = new Wishlist({ userId: req.user._id, products: [] });

      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
      }

      await wishlist.populate("products");
      res.json(wishlist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Remove product from wishlist
router.delete(
  "/remove/:productId",
  userAuth,
  async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({ userId: req.user._id });
      if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

      wishlist.products = wishlist.products.filter(p => p.toString() !== req.params.productId);
      await wishlist.save();
      await wishlist.populate("products");
      res.json(wishlist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;