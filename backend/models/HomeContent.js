import mongoose from "mongoose";

const homeContentSchema = new mongoose.Schema({
  sliders: [
    {
      imageUrl: { type: String, required: true },
      link: { type: String, default: "#" }
    }
  ],
  trendingImages: [
    {
      imageUrl: { type: String, required: true },
      link: { type: String, default: "#" }
    }
  ],
  aboutImage: {
    imageUrl: { type: String },
    description: { type: String, default: "" }
  },
  createdAt: { type: Date, default: Date.now }
});

const HomeContent = mongoose.model("HomeContent", homeContentSchema);
export default HomeContent;
