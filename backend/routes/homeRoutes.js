import express from "express";
import { authenticateAdmin } from "../middlewares/adminAuth.js";
import HomeContent from "../models/HomeContent.js";

const router = express.Router();

// GET home content
router.get("/", async (req, res) => {
  try {
    const content = await HomeContent.findOne();
    res.json(content || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE or UPDATE home content (admin only)
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) content = new HomeContent(req.body);
    else Object.assign(content, req.body);
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// SLIDERS
router.post("/slider", authenticateAdmin, async (req, res) => {
  try {
    const { imageUrl, link } = req.body;
    const content = await HomeContent.findOne() || new HomeContent();
    content.sliders.push({ imageUrl, link });
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/slider/:index", authenticateAdmin, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const content = await HomeContent.findOne();
    if (!content || !content.sliders[index]) return res.status(404).json({ message: "Slider not found" });
    content.sliders.splice(index, 1);
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TRENDING IMAGES
router.post("/trending", authenticateAdmin, async (req, res) => {
  try {
    const { imageUrl, link } = req.body;
    const content = await HomeContent.findOne() || new HomeContent();
    content.trendingImages.push({ imageUrl, link });
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/trending/:index", authenticateAdmin, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const content = await HomeContent.findOne();
    if (!content || !content.trendingImages[index]) return res.status(404).json({ message: "Trending image not found" });
    content.trendingImages.splice(index, 1);
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ABOUT IMAGE
router.post("/about", authenticateAdmin, async (req, res) => {
  try {
    const { imageUrl, description } = req.body;
    const content = await HomeContent.findOne() || new HomeContent();
    content.aboutImage = { imageUrl, description };
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
